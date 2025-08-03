import React from "react";
import Editor from "@monaco-editor/react";
import { Play, Sparkles } from "lucide-react";

const CodeEditorPanel = ({
  code,
  input,
  output,
  loading,
  language,
  theme,
  showAIPanel,
  setShowAIPanel,
  onCodeChange,
  onRunCode,
  onInputChange,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">💻 Code Editor</h1>
        <div className="flex gap-3">
          {/* Toggle AI Assistant */}
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 shadow-md ${
              showAIPanel
                ? "bg-purple-700 hover:bg-purple-800"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <Sparkles size={18} />
            {showAIPanel ? "Hide AI" : "AI Assistant"}
          </button>

          {/* Run Code */}
          <button
            onClick={onRunCode}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 shadow-md ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Play size={18} />
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="relative h-[60vh] rounded-lg overflow-hidden border border-gray-300 shadow-sm">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onCodeChange}
          theme={theme}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Input and Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🧾 Custom Input
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 shadow-inner"
            placeholder="Enter input for your code..."
            value={input}
            onChange={onInputChange}
          />
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📤 Output
          </label>
          <div className="bg-black text-green-400 p-3 rounded-lg overflow-y-auto h-32 text-sm font-mono whitespace-pre-wrap shadow-inner border border-gray-600">
            {output || "Output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
