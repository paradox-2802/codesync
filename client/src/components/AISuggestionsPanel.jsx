import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const AISuggestionsPanel = ({
  suggestion,
  error,
  isLoading,
  onApplySuggestion,
  setSuggestion,
  language = "javascript", // default
}) => {
  return (
    <div className="flex flex-col h-full space-y-4 p-4 bg-[#f6f0ff] border-l rounded shadow-inner">
      {error && (
        <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {suggestion ? (
        <>
          <SyntaxHighlighter
            language={language}
            style={oneLight}
            customStyle={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "#faf5ff",
              fontSize: "0.875rem",
              maxHeight: "500px",
              overflow: "auto",
              border: "1px solid #e0d4ff",
            }}
          >
            {suggestion}
          </SyntaxHighlighter>

          <div className="flex gap-3 justify-end pt-2 border-t mt-4">
            <button
              onClick={() => onApplySuggestion(suggestion)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={() => setSuggestion("")}
              className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Click the <strong>Suggest</strong> button above to generate an AI
          suggestion.
        </p>
      )}
    </div>
  );
};

export default AISuggestionsPanel;
