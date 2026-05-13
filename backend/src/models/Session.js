import mongoose from "mongoose";
import mongooose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call Id
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Session = mongoose.model("Session", SessionSchema);
