// server/routes/aiRoutes.js
import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import express from "express";
import { InferenceClient } from "@huggingface/inference";

const router = express.Router();

// Initialize Hugging Face client
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

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
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500, // Kept similar to previous logic
    });

    // Extract and clean the suggestion
    const suggestion = response.choices[0].message.content;
    // .replace(/```[\s\S]*?\n|```/g, "") // Remove code blocks if needed, but sometimes Llama outputs clean code. keeping it clean might be safer.
    // Let's stick to the user's provided snippet logic which just returns content.
    // However, the user's snippet didn't have the cleaning logic. I'll keep the cleaning logic from the original file if it helps,
    // but the user's request explicitly showed: console.log(response.choices[0].message.content); return response.choices[0].message.content;
    // The original code had: .replace(/```[\s\S]*?\n|```/g, "").trim();
    // I will keep the cleaning logic because it's usually better for "Apply Suggestion" features to not have markdown fences.

    const cleanSuggestion = suggestion.replace(/```[\s\S]*?\n|```/g, "").trim();

    res.json({ suggestion: cleanSuggestion });
  } catch (error) {
    console.error("AI suggestion error:", error);
    res.status(500).json({ error: "Failed to get AI suggestions" });
  }
});

export default router;
