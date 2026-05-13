import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession, endSession } from "../controller/sessionController.js";

const router = express.Router();

router.post("/", protectedRoute, createSession);
router.get("/active", protectedRoute, getActiveSessions);
router.get("/my-recent-sessions", protectedRoute, getMyRecentSessions);

router.get("/:sessionId", protectedRoute, getSessionById);
router.post("/:sessionId/join", protectedRoute, joinSession);
router.post("/:sessionId/end", protectedRoute, endSession);

export default router;