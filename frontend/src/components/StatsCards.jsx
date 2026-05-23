import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      
      {/* Active Sessions */}
      <div className="rounded-2xl border border-[#E0D9CF] p-6"
        style={{ backgroundColor: "white" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: "#F5F0E8" }}>
            <UsersIcon className="size-6 text-[#1A1A1A]" />
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
            <span className="size-1.5 rounded-full bg-green-500 inline-block" />
            Live
          </span>
        </div>
        <div className="text-4xl font-black text-[#1A1A1A] mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {activeSessionsCount}
        </div>
        <div className="text-sm text-[#9B9590]">Active Sessions</div>
      </div>

      {/* Total Sessions */}
      <div className="rounded-2xl border border-[#E0D9CF] p-6"
        style={{ backgroundColor: "white" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: "#F5F0E8" }}>
            <TrophyIcon className="size-6 text-[#1A1A1A]" />
          </div>
        </div>
        <div className="text-4xl font-black text-[#1A1A1A] mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {recentSessionsCount}
        </div>
        <div className="text-sm text-[#9B9590]">Total Sessions</div>
      </div>

    </div>
  );
}
export default StatsCards;