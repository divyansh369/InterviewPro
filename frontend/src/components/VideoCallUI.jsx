// import {
//   CallControls,
//   CallingState,
//   SpeakerLayout,
//   useCallStateHooks,
// } from "@stream-io/video-react-sdk";
// import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { Channel, Chat, MessageList, Thread, Window } from "stream-chat-react";

// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import "stream-chat-react/dist/css/index.css";

// function VideoCallUI({ chatClient, channel }) {
//   const navigate = useNavigate();
//   const { useCallCallingState, useParticipantCount } = useCallStateHooks();
//   const callingState = useCallCallingState();
//   const participantCount = useParticipantCount();
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   if (callingState === CallingState.JOINING) {
//     return (
//       <div className="h-full flex items-center justify-center"
//         style={{ backgroundColor: "#F5F0E8" }}>
//         <div className="text-center">
//           <Loader2Icon className="w-12 h-12 mx-auto animate-spin mb-4"
//             style={{ color: "#1A1A1A" }} />
//           <p className="text-lg font-medium text-[#1A1A1A]">Joining call...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex gap-3 p-3 str-video"
//       style={{ backgroundColor: "#F5F0E8" }}>

//       {/* LEFT — Video + Controls */}
//       <div className="flex-1 flex flex-col gap-3 min-w-0">

//         {/* TOP BAR */}
//         <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#E0D9CF]"
//           style={{ backgroundColor: "white" }}>
//           <div className="flex items-center gap-2">
//             <UsersIcon className="size-4 text-[#1A1A1A]" />
//             <span className="text-sm font-semibold text-[#1A1A1A]">
//               {participantCount} {participantCount === 1 ? "participant" : "participants"}
//             </span>
//           </div>

//           {chatClient && channel && (
//             <button
//               onClick={() => setIsChatOpen(!isChatOpen)}
//               className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
//               style={{
//                 backgroundColor: isChatOpen ? "#1A1A1A" : "#F5F0E8",
//                 color: isChatOpen ? "white" : "#6B7280",
//                 border: "1px solid #E0D9CF",
//               }}>
//               <MessageSquareIcon className="size-4" />
//               Chat
//             </button>
//           )}
//         </div>

//         {/* VIDEO */}
//         <div className="flex-1 rounded-xl overflow-hidden border border-[#E0D9CF]"
//           style={{ backgroundColor: "#1A1A1A" }}>
//           <SpeakerLayout />
//         </div>

//         {/* CALL CONTROLS */}
//         <div className="flex justify-center px-4 py-3 rounded-xl border border-[#E0D9CF]"
//           style={{ backgroundColor: "white" }}>
//           <CallControls onLeave={() => navigate("/dashboard")} />
//         </div>

//       </div>

//       {/* RIGHT — Chat */}
//       {chatClient && channel && (
//         <div
//           className="flex flex-col rounded-xl overflow-hidden border border-[#3a3d44] transition-all duration-300"
//           style={{
//             width: isChatOpen ? "320px" : "0px",
//             opacity: isChatOpen ? 1 : 0,
//             backgroundColor: "#1c1e22",
//             flexShrink: 0,
//           }}>
//           {isChatOpen && (
//             <>
//               {/* Chat Header */}
//               <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3d44]"
//                 style={{ backgroundColor: "#1c1e22" }}>
//                 <h3 className="font-semibold text-white text-sm">Session Chat</h3>
//                 <button
//                   onClick={() => setIsChatOpen(false)}
//                   className="text-gray-400 hover:text-white transition-colors">
//                   <XIcon className="size-4" />
//                 </button>
//               </div>

//               {/* Chat Body */}
//               <div className="flex-1 overflow-hidden">
//                 <Chat client={chatClient} theme="str-chat__theme-dark">
//                   <Channel channel={channel}>
//                     <Window>
//                       <MessageList />
//                     </Window>
//                     <Thread />
//                   </Channel>
//                 </Chat>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//     </div>
//   );
// }

// export default VideoCallUI;

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, EllipsisIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-base-200">
        <div className="text-center">
          <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-primary mb-3" />
          <p className="text-sm font-medium text-base-content/70">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#0f0f0f" }}>
      {/* Interview Room Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0f0f0f]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Interview Room</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Connected
          </span>
        </div>
        {/* signal bars */}
        <div className="flex items-end gap-px h-4">
          {[6, 9, 12, 15].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-sm bg-emerald-400"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      {/* Video Grid — 2 tiles side by side */}
      <div className="grid grid-cols-2 gap-1.5 p-2" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="relative rounded-lg overflow-hidden bg-[#1c1e22] aspect-video">
          <SpeakerLayout />
        </div>
        <div className="relative rounded-lg overflow-hidden bg-[#1c1e22] aspect-video flex items-end p-2">
          <span className="absolute bottom-2 left-2 text-xs font-semibold text-white/80 bg-black/50 px-2 py-0.5 rounded">
            interviewer
          </span>
        </div>
      </div>

      {/* Call Controls — mic, camera, screen share, hang up */}
      <div
        className="flex items-center justify-center py-3 border-t border-white/10"
        style={{ backgroundColor: "#0f0f0f" }}
      >
        <CallControls onLeave={() => navigate("/dashboard")} />
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Chat Section */}
      {chatClient && channel ? (
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-base-200">
            <span className="text-sm font-semibold text-base-content">Chat</span>
            <button className="text-base-content/30 hover:text-base-content transition-colors">
              <EllipsisIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Stream Chat */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Chat client={chatClient} theme="str-chat__theme-light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </div>
      ) : (
        /* No chat client yet — empty state */
        <div className="flex-1 flex flex-col items-center justify-center bg-white gap-3">
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-base-content/40 text-center px-4">
            Send a message to start the conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;