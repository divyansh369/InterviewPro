import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Waypoints } from "lucide-react";
import { UserButton } from "@clerk/react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E0D9CF]" 
      style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Waypoints className="size-5 text-[#1A1A1A]" strokeWidth={2.2} />
          <span className="text-[21px] font-semibold tracking-tight text-[#1A1A1A]">
            InterviewPro
          </span>
        </Link>

        <div className="flex items-center gap-1">
          
          {/* PROBLEMS */}
          <Link to="/problems"
            className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isActive("/problems") ? "#1A1A1A" : "transparent",
              color: isActive("/problems") ? "white" : "#6B7280",
            }}>
            <BookOpenIcon className="size-4" />
            <span className="font-medium hidden sm:inline">Problems</span>
          </Link>

          {/* DASHBOARD */}
          <Link to="/dashboard"
            className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isActive("/dashboard") ? "#1A1A1A" : "transparent",
              color: isActive("/dashboard") ? "white" : "#6B7280",
            }}>
            <LayoutDashboardIcon className="size-4" />
            <span className="font-medium hidden sm:inline">Dashboard</span>
          </Link>

          <div className="ml-4 mt-1">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;