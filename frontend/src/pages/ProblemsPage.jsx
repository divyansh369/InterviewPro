import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problem.js";
import { ChevronRightIcon, Code2Icon, SearchIcon } from "lucide-react";

const difficultyStyles = {
  Easy:   { backgroundColor: "#DCFCE7", color: "#166534" },
  Medium: { backgroundColor: "#FEF9C3", color: "#854D0E" },
  Hard:   { backgroundColor: "#FEE2E2", color: "#991B1B" },
};

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const easyCount   = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount   = problems.filter((p) => p.difficulty === "Hard").length;

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER ROW */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold mb-1 text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Practice Problems
            </h1>
            <p className="text-[#6B7280] text-sm">
              Sharpen your skills, one problem at a time
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0D9CF]"
              style={{ backgroundColor: "white" }}>
              <SearchIcon className="size-4 text-[#9B9590]" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm bg-transparent text-[#1A1A1A] placeholder-[#9B9590] w-48"
              />
            </div>

            {/* Filter Pills */}
            {["All", "Easy", "Medium", "Hard"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
                style={{
                  backgroundColor: filter === f ? "#1A1A1A" : "white",
                  color: filter === f ? "white" : "#6B7280",
                  borderColor: filter === f ? "#1A1A1A" : "#E0D9CF",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT — problems + sidebar */}
        <div className="flex gap-6 items-start">

          {/* PROBLEMS LIST */}
          <div className="flex-1 space-y-3">
            {filtered.map((problem, index) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl px-6 py-4 border border-[#E0D9CF] hover:border-[#C5BDB4] hover:scale-[1.01] transition-all duration-200"
                style={{ backgroundColor: "white" }}
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-sm font-medium text-[#9B9590] w-6 flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#FFD60A" }}>
                    <Code2Icon className="size-5 text-[#1A1A1A]" />
                  </div>
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

                {/* RIGHT */}
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

            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#9B9590]">
                No problems found
              </div>
            )}
          </div>

          {/* PROGRESS SIDEBAR */}
          <div className="w-72 flex-shrink-0 rounded-2xl border border-[#E0D9CF] p-6 sticky top-24"
            style={{ backgroundColor: "white" }}>
            <p className="text-xs font-semibold text-[#9B9590] tracking-widest mb-4">
              YOUR PROGRESS
            </p>

            {/* Big number */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black text-[#1A1A1A]"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {easyCount + mediumCount + hardCount}
              </span>
              <span className="text-sm text-[#9B9590]">problems solved</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-2 overflow-hidden"
              style={{ backgroundColor: "#E0D9CF" }}>
              <div className="h-full rounded-full"
                style={{
                  backgroundColor: "#1A1A1A",
                  width: `${Math.round(((easyCount + mediumCount + hardCount) / problems.length) * 100)}%`
                }} />
            </div>
            <p className="text-xs text-[#9B9590] mb-6">
              {Math.round(((easyCount + mediumCount + hardCount) / problems.length) * 100)}% of {problems.length}
            </p>

            {/* Breakdown */}
            <div className="space-y-3">
              {[
                { label: "Easy",   count: easyCount,   dot: "#22c55e" },
                { label: "Medium", count: mediumCount, dot: "#eab308" },
                { label: "Hard",   count: hardCount,   dot: "#ef4444" },
              ].map(({ label, count, dot }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: dot }} />
                    <span className="text-sm text-[#6B7280]">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A1A]">{count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;