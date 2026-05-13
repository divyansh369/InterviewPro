import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/database.js";
import { inngest, InngestFunctions } from "./lib/inngest.js";
import { protectedRoute } from "./middleware/protectedRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: InngestFunctions,
    signingKey: ENV.INNGEST_SIGNING_KEY,
  }),
);

app.use("/api/chat",chatRoutes)
app.use("/api/sessions",sessionRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "OK" });
});

// *** for testing protected route ***
// app.get("/video-call",protectedRoute, (req,res) => {
//   res.status(200).json({msg:"This is a protected route for video call", user:req.user});
// })

connectDB()
  .then((conn) => {
    console.log(
      "\n✅ Connected to MongoDB : ",
      conn.connection.host,
      conn.connection.name,
    );
    app.listen(ENV.PORT, () => {
      console.log("Server is running on port " + ENV.PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB ❌", err);
  });
