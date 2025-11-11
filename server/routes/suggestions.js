// server/routes/aiRoutes.js
import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import express from "express";
import OpenAI from "openai";
const router = express.Router();

// Initialize A4F client with custom API base URL
const a4fClient = new OpenAI({
  apiKey: process.env.A4F_API_KEY,
  baseURL: "https://api.a4f.co/v1",
});

// Language validation helper
const isValidLanguage = (lang) =>
  ["javascript", "python", "cpp", "java"].includes(lang);

router.post("/", async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validate input
    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ error: "Code input is required and must be a string" });
    }

    if (code.length > 10000) {
      return res
        .status(400)
        .json({ error: "Code exceeds maximum length of 10,000 characters" });
    }

    if (!language || !isValidLanguage(language)) {
      return res.status(400).json({
        error:
          "Invalid language. Supported languages: javascript, python, cpp, java",
      });
    }

    // Craft the prompt for code improvements
    const prompt = `Optimize this ${language} code. Focus on:
- Modern syntax and best practices
- Performance improvements
- Error handling
- Readability and maintainability
- Return only the optimized code without any explanations or text.

Original code:
${code}`;

    // Get AI suggestion
    const response = await a4fClient.chat.completions.create({
      model: "provider-5/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // Lower temperature for more deterministic output
      max_tokens: 1500, // Slightly higher token limit
    });

    // Extract and clean the suggestion
    const suggestion = response.choices[0].message.content
      .replace(/```[\s\S]*?\n|```/g, "") // Remove code blocks
      .trim();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI suggestion error:", error);

    // Handle different error types
    let status = 500;
    let message = "Failed to get AI suggestions";

    if (error.response) {
      // A4F API error
      status = error.response.status;
      message = error.response.data.error?.message || "AI service error";
    } else if (error.request) {
      // No response received
      message = "No response from AI service";
    }

    res.status(status).json({ error: message });
  }
});

export default router;
