import { chatClient, streamClient } from "../lib/stream.js";
import { Session } from "../models/Session.js";
import { cleanupSession } from "../services/SessionCleanup.js";

export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ msg: "Problem and difficulty are required" });
    }

    // generate a unique callId for stream video call
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create a new session in database
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
      lastActivityAt: Date.now(),
    });
    console.log(session)

    let videoCallCreated = false;
    try {
      // create a stream video call
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });

      // set to true if video call is created
      videoCallCreated = true;

      // create a stream chat messaging
      const chatChannel = chatClient.channel("messaging", callId, {
        name: `Session Chat - ${problem}`,
        members: [clerkId], // add the host to the chat channel which will be 1 when created
        created_by_id: clerkId,
      });

      await chatChannel.create();
    } catch (error) {
      // delete the session if video call is not created
      await Session.findByIdAndDelete(session._id);

      if (videoCallCreated) {
        await streamClient.video
          .call("default", callId)
          .delete({ hard: true })
          .catch(console.error);
      }
      throw error;
    }

    res.status(201).json({ msg: "Session created successfully", session });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const getActiveSessions = async (req, res) => {
  try {
    const ActiveSessions = await Session.find({ status: "active" })
      .populate("host", "name profileImg email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    if (ActiveSessions.length === 0) {
      return res.status(204).json({ msg: "No active sessions found" });
    }

    return res.status(200).json({
      msg: "Active sessions fetched successfully",
      sessions: ActiveSessions,
    });
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    // get the session where the user is host or participant
    const recentSessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participants: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(7);

    res.status(200).json({
      msg: "My recent sessions fetched successfully",
      recentSessions,
    });
  } catch (error) {
    console.error("Error fetching my recent sessions:", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const getSessionById = await Session.findById(sessionId)
      .populate("host", "name profileImg email clerkId")
      .populate("participants", "name profileImg email clerkId");

    if (!getSessionById) {
      return res.status(404).json({ msg: "Session not found" });
    }

    res.status(200).json({
      msg: "Session fetched successfully",
      session: getSessionById,
    });
  } catch (error) {
    console.error("Error fetching session by id:", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// *** for joining session from the other user (not host) perspective ***
export const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const sessionToJoin = await Session.findById(sessionId);

    if (!sessionToJoin) {
      return res.status(404).json({ msg: "Session not found" });
    }

    // check if the session is full (for example max 2 participants for now)
    if (sessionToJoin.participants.length >= 2) {
      return res.status(409).json({ msg: "Session is full" });
    }

    // another check for active session
    if (sessionToJoin.status !== "active") {
      return res.status(400).json({ msg: "Session is not active" });
    }

    if (sessionToJoin.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ msg: "Host cannot join their session as a participant" });
    }

    // add the user to the session participants
    sessionToJoin.lastActivityAt = Date.now();
    sessionToJoin.participants.push(userId);
    await sessionToJoin.save();

    // add the user to chat
    const chatChannel = chatClient.channel("messaging", sessionToJoin.callId);
    await chatChannel.addMembers([clerkId]);

    res
      .status(200)
      .json({ msg: "Joined session successfully", session: sessionToJoin });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const sessionToEnd = await Session.findById(sessionId);

    if (!sessionToEnd) {
      return res.status(404).json({ msg: "Session not found" });
    }

    // check if user is the host of the session only host can end the session
    if (sessionToEnd.host.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Only host can end the session" });
    }

    // if session is already completed
    if (sessionToEnd.status === "completed") {
      return res.status(400).json({ msg: "Session is already completed" });
    }

    // end the stream video call
    // const call = streamClient.video.call("default", sessionToEnd.callId);
    // await call.delete({ hard: true });

    // // end the stream chat channel
    // const chatChannel = chatClient.channel("messaging", sessionToEnd.callId);
    // await chatChannel.delete();

    // sessionToEnd.lastActivityAt = Date.now();
    // sessionToEnd.status = "completed";
    // await sessionToEnd.save();

    await cleanupSession(sessionToEnd)

    res
      .status(200)
      .json({ msg: "Session ended successfully", session: sessionToEnd });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const heartbeat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(sessionId)

    if (!sessionId) {
      return res.status(404).json({ msg: "Session not found" })
    }

    // check user authentication 
    if (session.host.toString() !== userId.toString() && !session.participants.includes(userId)) {
      return res.status(403).json({ msg: "Unauthorized to send heartbeat for this session" })
    }

    session.lastActivityAt = Date.now();
    await session.save()

    res.status(200).json({ msg: "Heartbeat recorded successfully" })
    console.log('heartbeat 💓💓💓')

  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    })
  }
}
