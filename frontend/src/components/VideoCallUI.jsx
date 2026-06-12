import {
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, EllipsisIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, MonitorIcon, PhoneOffIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const call = useCall();
  const { useCallCallingState, useParticipantCount, useMicrophoneState, useCameraState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const { microphone, optionsAwareIsMute: isMicMuted } = useMicrophoneState();
  const { camera, optionsAwareIsMute: isCamOff } = useCameraState();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleMic = async () => {
    try { await microphone.toggle(); }
    catch (e) { console.error("mic toggle", e); }
  };

  const toggleCamera = async () => {
    try { await camera.toggle(); }
    catch (e) { console.error("camera toggle", e); }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await call?.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await call?.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (e) { console.error("screen share", e); }
  };

  const [isLeaving, setIsLeaving] = useState(false);

  const leaveCall = async () => {
    setIsLeaving(true); // unmounts <Chat> immediately
    setTimeout(async () => {
      try { await call?.leave(); } catch (_) {}
      navigate("/dashboard");
    }, 200);
  };

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

      {/* Hide Stream SDK's connection quality indicator next to participant name */}
      <style>{`
        .str-video__loading-indicator,
        .str-video__loading-indicator__icon,
        .str-video__participant-details__name--audio-connecting,
        .spinner,
        .str-video__participant-details__speaking-indicator,
        [class*="speaking-indicator"] {
          display: none !important;
        }

        /* Move notification out of video tile to bottom center */
        .str-video__notification-wrapper {
          position: fixed !important;
          bottom: 70px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          top: auto !important;
          z-index: 9999 !important;
          width: auto !important;
        }
        .str-video__notification {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          background: #1f2937 !important;
          color: #f9fafb !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-size: 11px !important;
          max-height: none !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        /* Hide inline connection quality bar inside participant tile */
        .str-video__participant-details__connection-quality,
        .str-video__participant-details__connection-quality--poor {
          display: none !important;
        }
        .str-video__participant-details {
          background: rgba(0,0,0,0.5) !important;
          padding: 2px 8px !important;
          border-radius: 4px !important;
          display: flex !important;
          align-items: center !important;
        }
        .str-video__participant-details__name {
          display: block !important;
          font-size: 12px !important;
          color: white !important;
        }
      `}</style>

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

      {/* Call Controls — fully custom so they're always visible */}
      <div
        className="flex items-center justify-center gap-3 py-3 border-t border-white/10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {/* Mic */}
        <button
          onClick={toggleMic}
          title={isMicMuted ? "Unmute" : "Mute"}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: isMicMuted ? "#ef4444" : "#2a2a2a", color: "white" }}
        >
          {isMicMuted ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          title={isCamOff ? "Turn on camera" : "Turn off camera"}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: isCamOff ? "#ef4444" : "#2a2a2a", color: "white" }}
        >
          {isCamOff ? <VideoOffIcon className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          title="Screen share"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: isScreenSharing ? "#3b82f6" : "#2a2a2a", color: "white" }}
        >
          <MonitorIcon className="w-4 h-4" />
        </button>

        {/* Leave */}
        <button
          onClick={leaveCall}
          title="Leave call"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#ef4444", color: "white" }}
        >
          <PhoneOffIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Chat Section */}
      {!isLeaving && chatClient && channel ? (
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