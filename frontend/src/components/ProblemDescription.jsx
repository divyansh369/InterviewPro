const difficultyStyles = {
  Easy:   { backgroundColor: "#DCFCE7", color: "#166534" },
  Medium: { backgroundColor: "#FEF9C3", color: "#854D0E" },
  Hard:   { backgroundColor: "#FEE2E2", color: "#991B1B" },
};

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: "#F5F0E8" }}>
      
      {/* HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-[#E0D9CF]" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {problem.title}
          </h1>
          <span className="text-xs font-medium px-3 py-1 rounded-full"
            style={difficultyStyles[problem.difficulty] || {}}>
            {problem.difficulty}
          </span>
        </div>

        <p className="text-sm text-[#9B9590] mb-4">{problem.category}</p>

      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">

        {/* DESCRIPTION */}
        <div className="rounded-2xl border border-[#E0D9CF] p-5" style={{ backgroundColor: "white" }}>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-3">Description</h2>
          <div className="space-y-2 text-sm text-[#4B4540] leading-relaxed">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="rounded-2xl border border-[#E0D9CF] p-5" style={{ backgroundColor: "white" }}>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-4">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Example {idx + 1}
                </p>
                <div className="rounded-xl p-4 font-mono text-sm space-y-1.5 border border-[#E0D9CF]"
                  style={{ backgroundColor: "#F5F0E8" }}>
                  <div className="flex gap-2">
                    <span className="font-bold min-w-[70px]" style={{ color: "#854D0E" }}>Input:</span>
                    <span className="text-[#1A1A1A]">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold min-w-[70px]" style={{ color: "#166534" }}>Output:</span>
                    <span className="text-[#1A1A1A]">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 mt-1 border-t border-[#E0D9CF]">
                      <span className="text-xs text-[#6B7280] font-sans">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="rounded-2xl border border-[#E0D9CF] p-5" style={{ backgroundColor: "white" }}>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-3">Constraints</h2>
          <ul className="space-y-2">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#FFD60A]">♦</span>
                <code className="text-sm text-[#4B4540]">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default ProblemDescription;