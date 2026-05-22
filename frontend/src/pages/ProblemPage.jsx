import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problem";
import ProblemNavbar from "../components/ProblemNavbar";

import { Panel, Group, Separator } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentProblemId = id && PROBLEMS[id] ? id : "two-sum";
  const currentProblem = PROBLEMS[currentProblemId];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(currentProblem.starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => {
    setCode(PROBLEMS[newProblemId].starterCode[selectedLanguage]);
    setOutput(null);
    navigate(`/problem/${newProblemId}`);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh" }}>
      <ProblemNavbar
        onRunCode={handleRunCode}
        isRunning={isRunning}
        onToggleProblemList={() => setShowProblemList(!showProblemList)}
      />

      <div className="flex-1 min-h-0 relative">

        {/* SLIDING SIDEBAR */}
        <div
          className="absolute top-0 left-0 h-full z-40 flex flex-col border-r overflow-hidden transition-all duration-300"
          style={{
            width: showProblemList ? "300px" : "0px",
            backgroundColor: "#2d2d2d",
            borderColor: "#3d3d3d",
          }}
        >
          {/* SIDEBAR HEADER */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: "#3d3d3d" }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "#d4d4d4" }}
            >
              Problem List
            </span>
            <button
              onClick={() => setShowProblemList(false)}
              className="hover:opacity-70 transition-opacity text-lg"
              style={{ color: "#888" }}
            >
              ✕
            </button>
          </div>

          {/* PROBLEMS */}
          <div className="flex-1 overflow-y-auto">
            {Object.values(PROBLEMS).map((problem, index) => (
              <button
                key={problem.id}
                onClick={() => {
                  handleProblemChange(problem.id);
                  setShowProblemList(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left border-b transition-colors hover:opacity-80"
                style={{
                  borderColor: "#3d3d3d",
                  backgroundColor:
                    currentProblemId === problem.id ? "#3d3d3d" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs w-5 flex-shrink-0"
                    style={{ color: "#666" }}
                  >
                    {index + 1}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color:
                        currentProblemId === problem.id ? "#FFD60A" : "#d4d4d4",
                    }}
                  >
                    {problem.title}
                  </span>
                </div>
                <span
                  className="text-xs flex-shrink-0"
                  style={{
                    color:
                      problem.difficulty === "Easy"
                        ? "#86efac"
                        : problem.difficulty === "Medium"
                        ? "#fcd34d"
                        : "#fca5a5",
                  }}
                >
                  {problem.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* OVERLAY */}
        {showProblemList && (
          <div
            className="absolute inset-0 z-30"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={() => setShowProblemList(false)}
          />
        )}

        {/* MAIN PANELS */}
        <Group orientation="horizontal" style={{ height: "100%" }}>
          {/* LEFT — problem description, only this scrolls */}
          <Panel
            defaultSize={40}
            minSize={30}
            style={{ overflowY: "auto" }}
          >
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <Separator
            className="w-2 cursor-col-resize"
            style={{ backgroundColor: "#E0D9CF" }}
          />

          {/* RIGHT — editor + output */}
          <Panel defaultSize={60} minSize={30} style={{ padding: "12px 12px 12px 6px" }}>
            <div
              style={{
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #3d3d3d",
              }}
            >
              <Group orientation="vertical" style={{ height: "100%" }}>
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <Separator
                  className="h-2 cursor-row-resize"
                  style={{ backgroundColor: "#3d3d3d" }}
                />

                <Panel defaultSize={30} minSize={15}>
                  <OutputPanel output={output} />
                </Panel>
              </Group>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  );
}

export default ProblemPage;