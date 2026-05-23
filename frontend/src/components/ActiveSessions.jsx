import { ArrowRightIcon, Code2Icon, CrownIcon, LoaderIcon, SparklesIcon, UsersIcon, ZapIcon } from "lucide-react";
import { Link } from "react-router";

const difficultyStyles = {
  easy:   { backgroundColor: "#DCFCE7", color: "#166534" },
  medium: { backgroundColor: "#FEF9C3", color: "#854D0E" },
  hard:   { backgroundColor: "#FEE2E2", color: "#991B1B" },
};

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-[#E0D9CF] p-6"
      style={{ backgroundColor: "white" }}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: "#FFD60A" }}>
            <ZapIcon className="size-5 text-[#1A1A1A]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Live Sessions
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500" />
          <span className="text-sm text-[#6B7280]">{sessions.length} active</span>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderIcon className="size-8 animate-spin text-[#1A1A1A]" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session._id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E0D9CF] hover:border-[#C5BDB4] transition-all"
              style={{ backgroundColor: "#F5F0E8" }}>

              {/* LEFT */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative size-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFD60A" }}>
                  <Code2Icon className="size-6 text-[#1A1A1A]" />
                  <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1A1A1A] truncate">{session.problem}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={difficultyStyles[session.difficulty] || {}}>
                      {session.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <CrownIcon className="size-3" />
                      <span>{session.host?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="size-3" />
                      <span>{session.participant ? "2/2" : "1/2"}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={session.participant && !isUserInSession(session)
                        ? { backgroundColor: "#FEE2E2", color: "#991B1B" }
                        : { backgroundColor: "#DCFCE7", color: "#166534" }}>
                      {session.participant && !isUserInSession(session) ? "FULL" : "OPEN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              {session.participant && !isUserInSession(session) ? (
                <button className="px-4 py-2 rounded-full text-sm font-medium border border-[#D0C9BF] text-[#9B9590]"
                  disabled>
                  Full
                </button>
              ) : (
                <Link to={`/session/${session._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: "#1A1A1A" }}>
                  {isUserInSession(session) ? "Rejoin" : "Join"}
                  <ArrowRightIcon className="size-4" />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="size-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#F5F0E8" }}>
              <SparklesIcon className="size-8 text-[#9B9590]" />
            </div>
            <p className="font-semibold text-[#1A1A1A] mb-1">No active sessions</p>
            <p className="text-sm text-[#9B9590]">Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ActiveSessions;