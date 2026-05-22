import { Link, useLocation } from "react-router";
import {
  Waypoints,
  LayoutListIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  PlayIcon,
  Loader2Icon,
} from "lucide-react";
import { UserButton } from "@clerk/react";

function ProblemNavbar({ onRunCode, isRunning, onToggleProblemList }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#E0D9CF]"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* LEFT — logo + problem list */}
        <div className="flex items-center gap-4">
         <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-8 rounded-lg border-2 border-[#1A1A1A] flex items-center justify-center">
            <Waypoints
              className="size-5 text-[#1A1A1A]"
              strokeWidth={2.2}
            />
              
            </div>

            <span className="text-[21px] font-semibold tracking-tight text-[#1A1A1A]">
               InterviewPro
            </span>
          </Link>

          <div className="w-px h-4 bg-[#D0C9BF]" />

          <button
            onClick={onToggleProblemList}
            className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <LayoutListIcon className="size-4" />
            Problem List
          </button>
        </div>

        {/* CENTER — Run Code
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all"
          style={{
            backgroundColor: isRunning ? "#D0C9BF" : "#FFD60A",
            color: "#1A1A1A",
            cursor: isRunning ? "not-allowed" : "pointer",
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
        </button> */}

        {/* RIGHT — Problems, Dashboard, User */}
        <div className="flex items-center gap-1">
          <Link
            to="/problems"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium"
            style={{
              backgroundColor: isActive("/problems") ? "#1A1A1A" : "transparent",
              color: isActive("/problems") ? "white" : "#6B7280",
            }}
          >
            <BookOpenIcon className="size-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium"
            style={{
              backgroundColor: isActive("/dashboard") ? "#1A1A1A" : "transparent",
              color: isActive("/dashboard") ? "white" : "#6B7280",
            }}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="ml-2 mt-1">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ProblemNavbar;