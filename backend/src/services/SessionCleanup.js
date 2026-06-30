import { Session } from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export const cleanupSession = async (session) => {
    try {
        const call = streamClient.video.call("default", session.callId);
        await call.delete({ hard: true }).catch(console.error);

        const chatChannel = chatClient.channel("messaging", session.callId);
        await chatChannel.delete().catch(console.error);

        session.status = "completed";
        session.lastActivityAt = new Date();

        await session.save();
    } catch (error) {
        console.error("Cleanup failed:", error);
        throw error;
    }
};