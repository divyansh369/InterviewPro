import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ backgroundColor: "#F5F0E8" }}>
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin mb-4"
            style={{ color: "#1A1A1A" }} />
          <p className="text-lg font-medium text-[#1A1A1A]">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 p-3 str-video"
      style={{ backgroundColor: "#F5F0E8" }}>

      {/* LEFT — Video + Controls */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#E0D9CF]"
          style={{ backgroundColor: "white" }}>
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4 text-[#1A1A1A]" />
            <span className="text-sm font-semibold text-[#1A1A1A]">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: isChatOpen ? "#1A1A1A" : "#F5F0E8",
                color: isChatOpen ? "white" : "#6B7280",
                border: "1px solid #E0D9CF",
              }}>
              <MessageSquareIcon className="size-4" />
              Chat
            </button>
          )}
        </div>

        {/* VIDEO */}
        <div className="flex-1 rounded-xl overflow-hidden border border-[#E0D9CF]"
          style={{ backgroundColor: "#1A1A1A" }}>
          <SpeakerLayout />
        </div>

        {/* CALL CONTROLS */}
        <div className="flex justify-center px-4 py-3 rounded-xl border border-[#E0D9CF]"
          style={{ backgroundColor: "white" }}>
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>

      </div>

      {/* RIGHT — Chat */}
      {chatClient && channel && (
        <div
          className="flex flex-col rounded-xl overflow-hidden border border-[#3a3d44] transition-all duration-300"
          style={{
            width: isChatOpen ? "320px" : "0px",
            opacity: isChatOpen ? 1 : 0,
            backgroundColor: "#1c1e22",
            flexShrink: 0,
          }}>
          {isChatOpen && (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3d44]"
                style={{ backgroundColor: "#1c1e22" }}>
                <h3 className="font-semibold text-white text-sm">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors">
                  <XIcon className="size-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-hidden">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default VideoCallUI;