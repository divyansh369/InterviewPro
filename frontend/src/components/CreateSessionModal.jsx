import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problem";

function CreateSessionModal({ isOpen, onClose, roomConfig, setRoomConfig, onCreateRoom, isCreating }) {
  const problems = Object.values(PROBLEMS);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}>

      <div className="w-full max-w-lg rounded-2xl border border-[#E0D9CF] p-8 shadow-xl"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Create New Session
          </h3>
          <button onClick={onClose}
            className="p-2 rounded-full hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "#F5F0E8" }}>
            <XIcon className="size-4 text-[#1A1A1A]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* PROBLEM SELECT */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Select Problem <span style={{ color: "#991B1B" }}>*</span>
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-[#E0D9CF] outline-none text-sm text-[#1A1A1A]"
              style={{ backgroundColor: "#F5F0E8" }}
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({ difficulty: selectedProblem.difficulty, problem: e.target.value });
              }}>
              <option value="" disabled>Choose a coding problem...</option>
              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* SUMMARY */}
          {roomConfig.problem && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#E0D9CF]"
              style={{ backgroundColor: "#F5F0E8" }}>
              <Code2Icon className="size-5 text-[#1A1A1A] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#1A1A1A]">
                <p className="font-semibold mb-1">Room Summary</p>
                <p className="text-[#6B7280]">Problem: <span className="text-[#1A1A1A] font-medium">{roomConfig.problem}</span></p>
                <p className="text-[#6B7280]">Max Participants: <span className="text-[#1A1A1A] font-medium">2 (1-on-1 session)</span></p>
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 mt-8">
          <button onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full text-sm font-medium border border-[#E0D9CF] text-[#6B7280] hover:border-[#C5BDB4] transition-all">
            Cancel
          </button>
          <button onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all"
            style={{
              backgroundColor: isCreating || !roomConfig.problem ? "#D0C9BF" : "#1A1A1A",
              cursor: isCreating || !roomConfig.problem ? "not-allowed" : "pointer",
            }}>
            {isCreating
              ? <><LoaderIcon className="size-4 animate-spin" /> Creating...</>
              : <><PlusIcon className="size-4" /> Create Session</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}
export default CreateSessionModal;