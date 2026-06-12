// import { useUser } from "@clerk/react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
// import { PROBLEMS } from "../data/problem";
// import { executeCode } from "../lib/piston";
// import Navbar from "../components/Navbar";
// import { Panel, Group, Separator } from "react-resizable-panels"; // Updated imports for v4+
// import { getDifficultyBadgeClass } from "../lib/utils";
// import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
// import CodeEditorPanel from "../components/CodeEditorPanel";
// import OutputPanel from "../components/OutputPanel";

// import useStreamClient from "../hooks/useStreamClient";
// import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
// import VideoCallUI from "../components/VideoCallUI";

// function SessionPage() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { user } = useUser();
//   const [output, setOutput] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);

//   const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

//   const joinSessionMutation = useJoinSession();
//   const endSessionMutation = useEndSession();

//   const session = sessionData?.session;
//   const isHost = session?.host?.clerkId === user?.id;
//   const isParticipant = session?.participant?.clerkId === user?.id;

//   const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
//     session,
//     loadingSession,
//     isHost,
//     isParticipant
//   );

//   // find the problem data based on session problem title
//   const problemData = session?.problem
//     ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
//     : null;

//   const [selectedLanguage, setSelectedLanguage] = useState("javascript");
//   const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

//   // auto-join session if user is not already a participant and not the host
//   useEffect(() => {
//     if (!session || !user || loadingSession) return;
//     if (isHost || isParticipant) return;

//     joinSessionMutation.mutate(id, { onSuccess: refetch });

//     // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
//   }, [session, user, loadingSession, isHost, isParticipant, id]);

//   // redirect the "participant" when session ends
//   useEffect(() => {
//     if (!session || loadingSession) return;

//     if (session.status === "completed") navigate("/dashboard");
//   }, [session, loadingSession, navigate]);

//   // update code when problem loads or changes
//   useEffect(() => {
//     if (problemData?.starterCode?.[selectedLanguage]) {
//       setCode(problemData.starterCode[selectedLanguage]);
//     }
//   }, [problemData, selectedLanguage]);

//   const handleLanguageChange = (e) => {
//     const newLang = e.target.value;
//     setSelectedLanguage(newLang);
//     // use problem-specific starter code
//     const starterCode = problemData?.starterCode?.[newLang] || "";
//     setCode(starterCode);
//     setOutput(null);
//   };

//   const handleRunCode = async () => {
//     setIsRunning(true);
//     setOutput(null);

//     const result = await executeCode(selectedLanguage, code);
//     setOutput(result);
//     setIsRunning(false);
//   };

//   const handleEndSession = () => {
//     if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
//       // this will navigate the HOST to dashboard
//       endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
//     }
//   };

//   return (
//     <div className="h-screen bg-base-100 flex flex-col">
//       <Navbar />

//       <div className="flex-1">
//         {/* Swapped PanelGroup to Group */}
//         <Group direction="horizontal">
//           {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
//           <Panel defaultSize={50} minSize={30}>
//             {/* Swapped PanelGroup to Group */}
//             <Group direction="vertical">
//               {/* PROBLEM DSC PANEL */}
//               <Panel defaultSize={50} minSize={20}>
//                 <div className="h-full overflow-y-auto bg-base-200">
//                   {/* HEADER SECTION */}
//                   <div className="p-6 bg-base-100 border-b border-base-300">
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h1 className="text-3xl font-bold text-base-content">
//                           {session?.problem || "Loading..."}
//                         </h1>
//                         {problemData?.category && (
//                           <p className="text-base-content/60 mt-1">{problemData.category}</p>
//                         )}
//                         <p className="text-base-content/60 mt-2">
//                           Host: {session?.host?.name || "Loading..."} •{" "}
//                           {session?.participant ? 2 : 1}/2 participants
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <span
//                           className={`badge badge-lg ${getDifficultyBadgeClass(
//                             session?.difficulty
//                           )}`}
//                         >
//                           {session?.difficulty.slice(0, 1).toUpperCase() +
//                             session?.difficulty.slice(1) || "Easy"}
//                         </span>
//                         {isHost && session?.status === "active" && (
//                           <button
//                             onClick={handleEndSession}
//                             disabled={endSessionMutation.isPending}
//                             className="btn btn-error btn-sm gap-2"
//                           >
//                             {endSessionMutation.isPending ? (
//                               <Loader2Icon className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <LogOutIcon className="w-4 h-4" />
//                             )}
//                             End Session
//                           </button>
//                         )}
//                         {session?.status === "completed" && (
//                           <span className="badge badge-ghost badge-lg">Completed</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-6 space-y-6">
//                     {/* problem desc */}
//                     {problemData?.description && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
//                         <div className="space-y-3 text-base leading-relaxed">
//                           <p className="text-base-content/90">{problemData.description.text}</p>
//                           {problemData.description.notes?.map((note, idx) => (
//                             <p key={idx} className="text-base-content/90">
//                               {note}
//                             </p>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* examples section */}
//                     {problemData?.examples && problemData.examples.length > 0 && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

//                         <div className="space-y-4">
//                           {problemData.examples.map((example, idx) => (
//                             <div key={idx}>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="badge badge-sm">{idx + 1}</span>
//                                 <p className="font-semibold text-base-content">Example {idx + 1}</p>
//                               </div>
//                               <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
//                                 <div className="flex gap-2">
//                                   <span className="text-primary font-bold min-w-[70px]">
//                                     Input:
//                                   </span>
//                                   <span>{example.input}</span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <span className="text-secondary font-bold min-w-[70px]">
//                                     Output:
//                                   </span>
//                                   <span>{example.output}</span>
//                                 </div>
//                                 {example.explanation && (
//                                   <div className="pt-2 border-t border-base-300 mt-2">
//                                     <span className="text-base-content/60 font-sans text-xs">
//                                       <span className="font-semibold">Explanation:</span>{" "}
//                                       {example.explanation}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Constraints */}
//                     {problemData?.constraints && problemData.constraints.length > 0 && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
//                         <ul className="space-y-2 text-base-content/90">
//                           {problemData.constraints.map((constraint, idx) => (
//                             <li key={idx} className="flex gap-2">
//                               <span className="text-primary">•</span>
//                               <code className="text-sm">{constraint}</code>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Panel>

//               {/* Swapped PanelResizeHandle to Separator */}
//               <Separator className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

//               <Panel defaultSize={50} minSize={20}>
//                 {/* Swapped PanelGroup to Group */}
//                 <Group direction="vertical">
//                   <Panel defaultSize={70} minSize={30}>
//                     <CodeEditorPanel
//                       selectedLanguage={selectedLanguage}
//                       code={code}
//                       isRunning={isRunning}
//                       onLanguageChange={handleLanguageChange}
//                       onCodeChange={(value) => setCode(value)}
//                       onRunCode={handleRunCode}
//                     />
//                   </Panel>

//                   {/* Swapped PanelResizeHandle to Separator */}
//                   <Separator className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

//                   <Panel defaultSize={30} minSize={15}>
//                     <OutputPanel output={output} />
//                   </Panel>
//                 </Group>
//               </Panel>
//             </Group>
//           </Panel>

//           <Separator className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

//           {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
//           <Panel defaultSize={50} minSize={30}>
//             <div className="h-full bg-base-200 p-4 overflow-auto">
//               {isInitializingCall ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="text-center">
//                     <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
//                     <p className="text-lg">Connecting to video call...</p>
//                   </div>
//                 </div>
//               ) : !streamClient || !call ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="card bg-base-100 shadow-xl max-w-md">
//                     <div className="card-body items-center text-center">
//                       <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
//                         <PhoneOffIcon className="w-12 h-12 text-error" />
//                       </div>
//                       <h2 className="card-title text-2xl">Connection Failed</h2>
//                       <p className="text-base-content/70">Unable to connect to the video call</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-full">
//                   <StreamVideo client={streamClient}>
//                     <StreamCall call={call}>
//                       <VideoCallUI chatClient={chatClient} channel={channel} />
//                     </StreamCall>
//                   </StreamVideo>
//                 </div>
//               )}
//             </div>
//           </Panel>
//         </Group>
//       </div>
//     </div>
//   );
// }

// export default SessionPage;

import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problem";
import { executeCode } from "../lib/piston";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, BookmarkIcon, ChevronLeftIcon, ClockIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

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
  const [activeTab, setActiveTab] = useState("problem"); // problem | editorial | hints
  const [activeOutputTab, setActiveOutputTab] = useState("testcase"); // testcase | custom | console
  const elapsed = useTimer();

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

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
    <div className="h-screen bg-base-200 flex flex-col overflow-hidden font-sans">
      {/* ── TOP NAV ── */}
      <header className="h-12 flex items-center justify-between px-4 bg-base-100 border-b border-base-300 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-base-content/50 hover:text-base-content transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="font-bold text-base-content tracking-tight text-sm flex items-center gap-1.5">
            <span className="text-primary">&lt;/&gt;</span> InterviewPro
          </span>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-base-content/60 hover:text-base-content transition-colors flex items-center gap-1.5"
          >
            <span className="text-base">⊞</span> Dashboard
          </button>
          <button
            onClick={() => navigate("/problems")}
            className="text-base-content/60 hover:text-base-content transition-colors flex items-center gap-1.5"
          >
            <span className="text-base">📖</span> Problems
          </button>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-sm font-mono text-base-content/70 bg-base-200 px-3 py-1 rounded-lg">
            <ClockIcon className="w-4 h-4" />
            {elapsed}
          </div>

          {isHost && session?.status === "active" && (
            <button
              onClick={handleEndSession}
              disabled={endSessionMutation.isPending}
              className="btn btn-error btn-sm gap-1.5 h-8 min-h-0 text-xs font-semibold"
            >
              {endSessionMutation.isPending ? (
                <Loader2Icon className="w-3 h-3 animate-spin" />
              ) : (
                <LogOutIcon className="w-3 h-3" />
              )}
              End Session
            </button>
          )}

          {/* always show second End Session button for participant too (matching screenshot) */}
          {!isHost && session?.status === "active" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-error btn-outline btn-sm gap-1.5 h-8 min-h-0 text-xs font-semibold"
            >
              <LogOutIcon className="w-3 h-3" />
              End Session
            </button>
          )}

          {session?.status === "completed" && (
            <span className="badge badge-ghost">Completed</span>
          )}
        </div>
      </header>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="flex-1 flex min-h-0 gap-0">

        {/* ── LEFT: Problem Panel ── */}
        <aside className="w-[340px] shrink-0 flex flex-col bg-base-100 border-r border-base-300 overflow-hidden">
          {/* Problem title area */}
          <div className="px-5 pt-4 pb-3 border-b border-base-300">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-lg font-bold text-base-content leading-tight">
                {session?.problem || "Loading..."}
              </h1>
              <BookmarkIcon className="w-4 h-4 text-base-content/30 mt-1 shrink-0 ml-2" />
            </div>
            {problemData?.category && (
              <p className="text-xs text-base-content/50 mt-0.5">{problemData.category}</p>
            )}
            <p className="text-xs text-base-content/50 mt-1">
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
          <div className="flex border-b border-base-300 bg-base-100">
            {["Problem", "Editorial", "Hints"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 text-xs font-semibold py-2.5 transition-colors border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/50 hover:text-base-content"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm">
            {activeTab === "problem" && (
              <>
                {/* Description */}
                {problemData?.description && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base-content/40 text-xs">⊟</span>
                      <h2 className="font-semibold text-base-content text-xs uppercase tracking-widest">
                        Description
                      </h2>
                    </div>
                    <p className="text-base-content/80 leading-relaxed">
                      {problemData.description.text}
                    </p>
                    {problemData.description.notes?.map((note, i) => (
                      <p key={i} className="text-base-content/70 mt-2 leading-relaxed">{note}</p>
                    ))}
                  </section>
                )}

                {/* Examples */}
                {problemData?.examples?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base-content/40 text-xs">⊟</span>
                      <h2 className="font-semibold text-base-content text-xs uppercase tracking-widest">
                        Examples
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {problemData.examples.map((ex, i) => (
                        <div key={i}>
                          <p className="text-xs font-semibold text-base-content/60 mb-1.5">
                            Example {i + 1}
                          </p>
                          <div className="bg-base-200 rounded-lg p-3 font-mono text-xs space-y-1">
                            <div className="flex gap-2">
                              <span className="text-primary font-bold w-14 shrink-0">Input:</span>
                              <span className="text-base-content/80">{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-secondary font-bold w-14 shrink-0">Output:</span>
                              <span className="text-base-content/80">{ex.output}</span>
                            </div>
                            {ex.explanation && (
                              <p className="text-base-content/50 pt-1.5 border-t border-base-300 text-xs leading-relaxed">
                                <span className="font-semibold">Explanation:</span> {ex.explanation}
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
                      <span className="text-base-content/40 text-xs">⊟</span>
                      <h2 className="font-semibold text-base-content text-xs uppercase tracking-widest">
                        Constraints
                      </h2>
                    </div>
                    <ul className="space-y-1.5">
                      {problemData.constraints.map((c, i) => (
                        <li key={i} className="flex gap-2 text-base-content/70">
                          <span className="text-primary shrink-0">•</span>
                          <code className="text-xs">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}

            {activeTab === "editorial" && (
              <div className="text-base-content/50 text-sm py-8 text-center">
                Editorial coming soon.
              </div>
            )}

            {activeTab === "hints" && (
              <div className="text-base-content/50 text-sm py-8 text-center">
                No hints available.
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER: Code Editor + Output ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Code Editor — CodeEditorPanel owns its toolbar (language selector + Run Code) */}
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
          <div className="h-[220px] shrink-0 border-t border-base-300 bg-base-100 flex flex-col">
            {/* Output tabs */}
            <div className="flex items-center border-b border-base-300 px-1">
              {["Testcase", "Custom Testcase", "Console"].map((tab) => {
                const key = tab.toLowerCase().replace(/ /g, "");
                return (
                  <button
                    key={key}
                    onClick={() => setActiveOutputTab(key)}
                    className={`text-xs font-semibold px-4 py-2.5 border-b-2 transition-colors ${
                      activeOutputTab === key
                        ? "border-primary text-primary"
                        : "border-transparent text-base-content/50 hover:text-base-content"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}

              {/* Results summary shown when output exists */}
              {output && (
                <div className="ml-auto flex items-center gap-3 pr-4 text-xs">
                  {output.run?.stderr ? (
                    <span className="text-error font-semibold">Error</span>
                  ) : (
                    <>
                      <span className="text-success font-semibold flex items-center gap-1">
                        🎉 All testcases passed!
                      </span>
                      <span className="text-base-content/50">
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
        <aside className="w-[420px] shrink-0 flex flex-col bg-base-100 border-l border-base-300 overflow-hidden">
          {isInitializingCall ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-primary mb-3" />
                <p className="text-sm text-base-content/60">Connecting to video call...</p>
              </div>
            </div>
          ) : !streamClient || !call ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PhoneOffIcon className="w-8 h-8 text-error" />
                </div>
                <h3 className="font-semibold text-base-content mb-1">Connection Failed</h3>
                <p className="text-sm text-base-content/50">Unable to connect to the video call</p>
              </div>
            </div>
          ) : (
            <StreamVideo client={streamClient}>
              <StreamCall call={call}>
                <VideoCallUI chatClient={chatClient} channel={channel} />
              </StreamCall>
            </StreamVideo>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SessionPage;