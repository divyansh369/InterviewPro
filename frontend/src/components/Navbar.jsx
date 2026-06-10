import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Waypoints } from "lucide-react";
import { UserButton } from "@clerk/react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E0D9CF] bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center relative">
        {/* LEFT LOGO */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-8 rounded-lg border-2 border-[#1A1A1A] flex items-center justify-center">
              <Waypoints className="size-5 text-[#1A1A1A]" strokeWidth={2.2} />
            </div>

            <span className="text-[21px] font-semibold tracking-tight text-[#1A1A1A]">
              InterviewPro
            </span>
          </Link>
        </div>

        {/* CENTER NAV */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isActive("/dashboard")
                ? "#1A1A1A"
                : "transparent",
              color: isActive("/dashboard") ? "white" : "#6B7280",
            }}
          >
            <LayoutDashboardIcon className="size-4" />

            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link
            to="/problems"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isActive("/problems")
                ? "#1A1A1A"
                : "transparent",
              color: isActive("/problems") ? "white" : "#6B7280",
            }}
          >
            <BookOpenIcon className="size-4" />

            <span className="font-medium">Problems</span>
          </Link>
        </div>

        {/* RIGHT PROFILE */}
        <div className="flex-1 flex justify-end">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
