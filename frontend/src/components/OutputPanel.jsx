import {
  CheckCircleIcon,
  XCircleIcon,
  TerminalIcon,
} from "lucide-react";

function OutputPanel({ output }) {
  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-4 text-[#8b949e]" />

          <span className="text-sm font-medium text-[#e6edf3]">
            Console Output
          </span>
        </div>

        {output && (
          <div
            className={`
              flex items-center gap-1
              text-xs
              px-2 py-1
              rounded-full
              border
              ${
                output.success
                  ? "bg-[#12261e] border-[#1f6f43] text-[#3fb950]"
                  : "bg-[#2d1617] border-[#8b1e24] text-[#f85149]"
              }
            `}
          >
            {output.success ? (
              <>
                <CheckCircleIcon className="size-3" />
                Success
              </>
            ) : (
              <>
                <XCircleIcon className="size-3" />
                Failed
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 overflow-auto">
        {output === null ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <TerminalIcon className="size-10 text-[#30363d] mb-3" />

            <p className="text-[#8b949e] text-sm">
              Run your code to see execution results
            </p>
          </div>
        ) : output.success ? (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[#8b949e]">
              Standard Output
            </p>

            <pre
              className="
                text-sm
                font-mono
                whitespace-pre-wrap
                rounded-xl
                p-4
                border
                border-[#30363d]
                bg-[#010409]
                text-[#3fb950]
                overflow-auto
              "
            >
              {output.output}
            </pre>
          </div>
        ) : (
          <div className="space-y-4">
            {output.output && (
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8b949e] mb-2">
                  Standard Output
                </p>

                <pre
                  className="
                    text-sm
                    font-mono
                    whitespace-pre-wrap
                    rounded-xl
                    p-4
                    border
                    border-[#30363d]
                    bg-[#010409]
                    text-[#e6edf3]
                  "
                >
                  {output.output}
                </pre>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-[#8b949e] mb-2">
                Error Output
              </p>

              <pre
                className="
                  text-sm
                  font-mono
                  whitespace-pre-wrap
                  rounded-xl
                  p-4
                  border
                  border-[#5a1e24]
                  bg-[#160b0d]
                  text-[#ff7b72]
                "
              >
                {output.error}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;