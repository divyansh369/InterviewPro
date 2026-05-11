import { chatClient } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    // use clerkId (not the mongodb _id) => it should match the user ID used in stream 
    const token = chatClient.createToken(req.user.clerkId)

    return res.status(200).json({
        token,
        userId: req.user.clerkId,
        userName: req.user.name,
        userImg: req.user.image
    })

  } catch (error) {
    console.error("Error generating stream token:", error);
    return res.status(500).json({ msg: "Internal server error", err: error.message });
  }
};
