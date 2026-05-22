import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problem.js";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "#161b22", borderColor: "#30363d" }}
      >
        {/* LANGUAGE SELECT */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#21262d] border border-[#30363d]">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage].name}
              className="size-5"
            />

            <select
              value={selectedLanguage}
              onChange={onLanguageChange}
              className="bg-transparent text-[#e6edf3] text-sm outline-none cursor-pointer"
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-[#161b22]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RUN BUTTON */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:cursor-not-allowed"
          style={{
            backgroundColor: isRunning ? "#30363d" : "#FFD60A",
            color: isRunning ? "#8b949e" : "#1A1A1A",
          }}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      {/* EDITOR */}
      <div className="flex-1 p-3 bg-[#0d1117] overflow-hidden">
        <div className="h-full overflow-hidden rounded-xl border border-[#30363d]">
          <Editor
            height="100%"
            language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
            value={code}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "JetBrains Mono, monospace",
              fontLigatures: true,
              padding: {
                top: 16,
              },
              lineHeight: 24,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "all",
              roundedSelection: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditorPanel;
