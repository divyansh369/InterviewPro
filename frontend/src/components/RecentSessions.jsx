import { Clock, Code2, Loader, Trophy, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const difficultyStyles = {
  Easy:   { backgroundColor: "#DCFCE7", color: "#166534" },
  Medium: { backgroundColor: "#FEF9C3", color: "#854D0E" },
  Hard:   { backgroundColor: "#FEE2E2", color: "#991B1B" },
};

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E0D9CF] p-6"
      style={{ backgroundColor: "white" }}>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl" style={{ backgroundColor: "#1A1A1A" }}>
          <Clock className="size-5" style={{ color: "#FFD60A" }} />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Past Sessions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader className="size-8 animate-spin text-[#1A1A1A]" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session._id}
              className="rounded-xl border border-[#E0D9CF] p-4 hover:border-[#C5BDB4] transition-all"
              style={{ backgroundColor: "#F5F0E8" }}>

              {/* STATUS */}
              {session.status === "active" && (
                <div className="flex justify-end mb-2">
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
                    <span className="size-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    ACTIVE
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFD60A" }}>
                  <Code2 className="size-5 text-[#1A1A1A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1A1A1A] text-sm mb-1 truncate">
                    {session.problem}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={difficultyStyles[session.difficulty] || {}}>
                    {session.difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#6B7280] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3" />
                  <span>{session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E0D9CF]">
                <span className="text-xs font-semibold text-[#9B9590] uppercase">Completed</span>
                <span className="text-xs text-[#9B9590]">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="size-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#F5F0E8" }}>
              <Trophy className="size-8 text-[#9B9590]" />
            </div>
            <p className="font-semibold text-[#1A1A1A] mb-1">No sessions yet</p>
            <p className="text-sm text-[#9B9590]">Start your coding journey today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default RecentSessions;