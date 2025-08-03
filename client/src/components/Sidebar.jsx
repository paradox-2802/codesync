import React from "react";
import { ArrowLeft, Copy, Users2, Code2, Paintbrush } from "lucide-react";

const Sidebar = ({
  roomId,
  users,
  language,
  theme,
  copied,
  languageOptions,
  themeOptions,
  onCopyRoomId,
  onLanguageChange,
  onThemeChange,
  onLeaveRoom,
}) => {
  return (
    <aside className="w-72 bg-purple-100 border-r px-6 py-6 shadow-md flex flex-col justify-between">
      <div className="space-y-8">
        {/* Room ID Section */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-600" />
              Room ID
            </h2>
            <button
              onClick={onCopyRoomId}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              title="Copy Room ID"
            >
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-blue-800 text-sm break-all font-mono bg-blue-200 px-2 py-1 rounded">
            {roomId}
          </div>
        </div>

        {/* Users Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Users2 className="w-4 h-4 text-gray-600" />
            Users{" "}
            <span className="text-xs text-gray-500">({users.length})</span>
          </h3>
          <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {users.map((u, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700 px-2 py-1 rounded hover:bg-blue-100 transition"
              >
                <span className="text-blue-500">👤</span>
                <span className="truncate">{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-600" />
            Language
          </label>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={onLanguageChange}
              className="flex-1 p-2 border border-gray-300 rounded text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            >
              {Object.entries(languageOptions).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <img
              src={languageOptions[language].logo}
              alt={`${languageOptions[language].label} logo`}
              className="w-6 h-6 rounded shadow-sm"
            />
          </div>
        </div>

        {/* Theme Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-gray-600" />
            Theme
          </label>
          <select
            value={theme}
            onChange={onThemeChange}
            className="w-full p-2 border border-gray-300 rounded text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          >
            {themeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leave Room Button */}
      <button
        onClick={onLeaveRoom}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow transition text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Leave Room
      </button>
    </aside>
  );
};

export default Sidebar;
