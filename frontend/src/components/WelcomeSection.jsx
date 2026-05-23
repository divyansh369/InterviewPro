import { useUser } from "@clerk/react";
import { ArrowRightIcon } from "lucide-react";

function WelcomeSection({ onCreateSession, activeSessionsCount }) {
  const { user } = useUser();
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="pt-16 pb-8">
      <div className="flex items-start justify-between gap-8">

        {/* LEFT */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs">♦</span>
            <span className="text-xs font-semibold tracking-widest text-[#9B9590] uppercase">
              Dashboard / Welcome
            </span>
          </div>

          <h1 className="text-[48px] leading-[1.05] font-bold text-[#111111] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back, {user?.firstName || "there"}.{" "}
            Ready to <em>level up</em> your craft?
          </h1>

          <p className="text-[15px] leading-7 text-[#667085] max-w-lg mb-8">
            A focused workspace for live collaborative coding interviews —
            track active rooms, replay past sessions, and jump back in where you left off.
          </p>

          <button onClick={onCreateSession}
            className="flex items-center rounded-full overflow-hidden"
            style={{ backgroundColor: "#111111" }}>
            <span className="px-6 py-3 text-white font-semibold text-sm">
              Create session
            </span>
            <div className="size-10 rounded-full flex items-center justify-center m-1"
              style={{ backgroundColor: "#FFD60A" }}>
              <ArrowRightIcon className="size-4 text-[#111111]" />
            </div>
          </button>
        </div>

        {/* RIGHT — Profile Card */}
        <div className="flex-shrink-0 w-[280px]">
          <div className="rounded-[28px] border border-[#E8DED2] overflow-hidden"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>

            {/* Orange top */}
            <div className="relative h-[110px]"
              style={{
                background: "linear-gradient(135deg, #FF7A1A 0%, #F25C19 45%, #E24D12 100%)",
              }}>
              <div className="absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 45%)",
                }} />

              {activeSessionsCount > 0 && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm">
                  <span className="size-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#111111]">
                    {activeSessionsCount} LIVE NOW
                  </span>
                </div>
              )}

              {/* Avatar */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                <div className="size-20 rounded-full border-4 border-white bg-[#EFE9DF] shadow-lg overflow-hidden flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#111111]"
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                      {initials}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* White bottom */}
            <div className="pt-12 pb-5 px-5 text-center" style={{ backgroundColor: "#FCFBF8" }}>
              <h3 className="text-[18px] font-bold text-[#111111] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-[13px] text-[#7D766F] truncate mb-3">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              <div className="flex items-center justify-center gap-3 text-[11px] text-[#8B8378]">
                <span className="px-3 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: "#F2EAE2", color: "#5E564D" }}>
                  Developer
                </span>
                <span className="size-1 rounded-full" style={{ backgroundColor: "#C7BBAE" }} />
                <span>14-day streak</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
export default WelcomeSection;