import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problem.js";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

const difficultyStyles = {
  Easy:   { backgroundColor: "#DCFCE7", color: "#166534" },
  Medium: { backgroundColor: "#FEF9C3", color: "#854D0E" },
  Hard:   { backgroundColor: "#FEE2E2", color: "#991B1B" },
};

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyCount   = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount   = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#1A1A1A]">
            Practice Problems
          </h1>
          <p className="text-[#6B7280]">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl px-6 py-4 border border-[#E0D9CF] hover:border-[#C5BDB4] hover:scale-[1.01] transition-all duration-200"
              style={{ backgroundColor: "white" }}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4 flex-1">
                {/* Number */}
                <span className="text-sm font-medium text-[#9B9590] w-6">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFD60A" }}>
                  <Code2Icon className="size-5 text-[#1A1A1A]" />
                </div>

                {/* Title + Tags */}
                <div>
                  <h2 className="text-base font-bold text-[#1A1A1A] mb-1">
                    {problem.title}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.category.split("•").map((tag) => (
                      <span key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full border border-[#D0C9BF] text-[#6B7280]"
                        style={{ backgroundColor: "#F5F0E8" }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                  style={difficultyStyles[problem.difficulty] || {}}>
                  {problem.difficulty}
                </span>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: "#1A1A1A" }}>
                  Solve <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 rounded-2xl border border-[#E0D9CF] overflow-hidden"
          style={{ backgroundColor: "white" }}>
          <div className="grid grid-cols-4 divide-x divide-[#E0D9CF]">
            {[
              { label: "Total Problems", value: problems.length, color: "#1A1A1A" },
              { label: "Easy",           value: easyCount,       color: "#166534" },
              { label: "Medium",         value: mediumCount,     color: "#B45309" },
              { label: "Hard",           value: hardCount,       color: "#991B1B" },
            ].map((stat) => (
              <div key={stat.label} className="px-8 py-6">
                <div className="text-sm text-[#9B9590] mb-1">{stat.label}</div>
                <div className="text-3xl font-black"
                  style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export default ProblemsPage;