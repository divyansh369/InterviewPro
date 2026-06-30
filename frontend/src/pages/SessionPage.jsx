import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problem";
import { executeCode } from "../lib/piston";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, BookmarkIcon, ChevronLeftIcon, ClockIcon, LayoutDashboardIcon, BookOpenIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import { sessionApi } from "../api/sessions";

// Simple timer hook
function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const DIFFICULTY_STYLES = {
  easy: "bg-success/10 text-success border border-success/30",
  medium: "bg-warning/10 text-warning border border-warning/30",
  hard: "bg-error/10 text-error border border-error/30",
};

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [activeOutputTab, setActiveOutputTab] = useState("testcase");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const elapsed = useTimer();

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipants = session?.participants?.some(participant => participant.clerkId === user?.id);

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipants
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipants) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipants, id]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // sending the heartbeat
  useEffect(() => {
    if(!session) return ;
    const interval = setInterval(async()=>{
      try {
        await sessionApi.heartbeat(session._id);
        console.log("Heartbeat sent successfully");
      } catch (error) {
        console.log(error);
      }
    },2*60*1000)

    return () => clearInterval(interval);
  },[id,session,isHost,isParticipants])

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
    setActiveOutputTab("console");
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  const diffClass =
    DIFFICULTY_STYLES[session?.difficulty?.toLowerCase()] || DIFFICULTY_STYLES.easy;

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans" style={{ backgroundColor: "#f5f0e8" }}>
      {/* ── TOP NAV ── */}
      <header className="h-12 flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: "#f5f0e8" }}>
        {/* Left — Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm flex items-center gap-1.5" style={{ color: "#1a1a1a" }}>
            <span style={{ color: "#F5A623" }}>&lt;/&gt;</span> InterviewPro
          </span>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center gap-1 bg-white rounded-full px-1.5 py-1 shadow-sm border border-black/5">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ backgroundColor: "#1a1a1a", color: "white" }}
          >
            <LayoutDashboardIcon className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/problems")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ color: "#6b7280" }}
          >
            <BookOpenIcon className="w-3.5 h-3.5" />
            Problems
          </button>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border border-black/10 bg-white" style={{ color: "#1a1a1a" }}>
            <ClockIcon className="w-3.5 h-3.5" />
            {elapsed}
          </div>

          {isHost && session?.status === "active" && (
            <button
              onClick={handleEndSession}
              disabled={endSessionMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ backgroundColor: "#ef4444", color: "white" }}
            >
              {endSessionMutation.isPending ? (
                <Loader2Icon className="w-3 h-3 animate-spin" />
              ) : (
                <LogOutIcon className="w-3 h-3" />
              )}
              End Session
            </button>
          )}

          {!isHost && session?.status === "active" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              <LogOutIcon className="w-3 h-3" />
              End Session
            </button>
          )}

          {session?.status === "completed" && (
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-black/10 text-gray-500">Completed</span>
          )}
        </div>
      </header>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="flex-1 flex min-h-0 gap-2 px-2 pb-2">

        {/* ── LEFT: Problem Panel ── */}
        <aside className="w-[400px] shrink-0 flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: "white" }}>
          {/* Problem title area */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {session?.problem || "Loading..."}
              </h1>
              <BookmarkIcon className="w-4 h-4 text-gray-300 mt-1 shrink-0 ml-2" />
            </div>
            {problemData?.category && (
              <p className="text-xs text-gray-400 mt-0.5">{problemData.category}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Host: {session?.host?.name || "—"} · {session?.participant ? 2 : 1}/2 participants
            </p>

            {/* Difficulty badge */}
            {session?.difficulty && (
              <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffClass}`}>
                {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-white">
            {["Problem", "Editorial", "Hints"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 text-xs font-semibold py-2.5 transition-colors border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-[#F5A623] text-[#F5A623]"
                    : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-sm">
            {activeTab === "problem" && (
              <>
                {/* Description */}
                {problemData?.description && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-xs">⊞</span>
                      <h2 className="font-bold text-gray-900 text-xs uppercase tracking-widest">
                        Description
                      </h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-normal">
                      {problemData.description.text}
                    </p>
                    {problemData.description.notes?.map((note, i) => (
                      <p key={i} className="text-gray-500 mt-2 leading-relaxed italic">{note}</p>
                    ))}
                  </section>
                )}

                {/* Examples */}
                {problemData?.examples?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-300 text-xs">⊟</span>
                      <h2 className="font-semibold text-gray-900 text-xs uppercase tracking-widest">
                        Examples
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {problemData.examples.map((ex, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                          <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
                            <span className="text-xs font-bold text-gray-500 tracking-wide">Example {i + 1}</span>
                          </div>
                          <div className="bg-[#1e1e2e] p-3 font-mono text-xs space-y-1.5">
                            <div className="flex gap-2">
                              <span className="text-[#F5A623] font-bold w-14 shrink-0">Input:</span>
                              <span className="text-gray-300">{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-[#a78bfa] font-bold w-14 shrink-0">Output:</span>
                              <span className="text-gray-300">{ex.output}</span>
                            </div>
                            {ex.explanation && (
                              <p className="text-gray-500 pt-1.5 border-t border-gray-700 text-xs leading-relaxed">
                                <span className="font-semibold text-gray-400">Explanation:</span> {ex.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Constraints */}
                {problemData?.constraints?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-xs">⊞</span>
                      <h2 className="font-bold text-gray-900 text-xs uppercase tracking-widest">
                        Constraints
                      </h2>
                    </div>
                    <ul className="space-y-2">
                      {problemData.constraints.map((c, i) => (
                        <li key={i} className="flex gap-2 text-gray-600">
                          <span className="text-[#F5A623] shrink-0 font-bold">•</span>
                          <code className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-800 font-medium">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}

            {activeTab === "editorial" && (
              <div className="text-gray-400 text-sm py-8 text-center">
                Editorial coming soon.
              </div>
            )}

            {activeTab === "hints" && (
              <div className="text-gray-400 text-sm py-8 text-center">
                No hints available.
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER: Code Editor + Output ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-xl" style={{ backgroundColor: "white" }}>
          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditorPanel
              selectedLanguage={selectedLanguage}
              code={code}
              isRunning={isRunning}
              onLanguageChange={handleLanguageChange}
              onCodeChange={(val) => setCode(val)}
              onRunCode={handleRunCode}
            />
          </div>

          {/* Output / Test Results */}
          <div className="h-[300px] shrink-0 border-t border-gray-100 bg-white flex flex-col">
            <div className="flex items-center border-b border-gray-100 px-1">
              {["Testcase", "Custom Testcase", "Console"].map((tab) => {
                const key = tab.toLowerCase().replace(/ /g, "");
                return (
                  <button
                    key={key}
                    onClick={() => setActiveOutputTab(key)}
                    className={`text-xs font-semibold px-4 py-2.5 border-b-2 transition-colors ${
                      activeOutputTab === key
                        ? "border-[#F5A623] text-[#F5A623]"
                        : "border-transparent text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}

              {output && (
                <div className="ml-auto flex items-center gap-3 pr-4 text-xs">
                  {output.run?.stderr ? (
                    <span className="text-error font-semibold">Error</span>
                  ) : (
                    <>
                      <span className="text-success font-semibold flex items-center gap-1">
                        🎉 All testcases passed!
                      </span>
                      <span className="text-gray-400">
                        Runtime: {output.run?.time ? `${(output.run.time * 1000).toFixed(2)} ms` : "—"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto px-4 py-3">
              <OutputPanel output={output} activeTab={activeOutputTab} />
            </div>
          </div>
        </main>

        {/* ── RIGHT: Video + Chat ── */}
        <aside
          className="shrink-0 flex flex-col overflow-hidden rounded-xl transition-all duration-300"
          style={{ width: isChatOpen ? "960px" : "440px", backgroundColor: "#f5f0e8" }}
        >
          {isInitializingCall ? (
            <div className="flex-1 flex items-center justify-center" style={{ width: "440px" }}>
              <div className="text-center">
                <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-[#F5A623] mb-3" />
                <p className="text-sm text-gray-400">Connecting to video call...</p>
              </div>
            </div>
          ) : !streamClient || !call ? (
            <div className="flex-1 flex items-center justify-center p-6" style={{ width: "440px" }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#ef444420" }}>
                  <PhoneOffIcon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-semibold text-white mb-1">Connection Failed</h3>
                <p className="text-sm text-gray-400">Unable to connect to the video call</p>
              </div>
            </div>
          ) : (
            <StreamVideo client={streamClient}>
              <StreamCall call={call}>
                <VideoCallUI
                  chatClient={chatClient}
                  channel={channel}
                  onChatToggle={setIsChatOpen}
                />
              </StreamCall>
            </StreamVideo>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SessionPage;