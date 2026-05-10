import express from 'express';
import cors from 'cors';
import {serve} from 'inngest/express'
import { ENV } from './lib/env.js';
import { connectDB } from './lib/database.js';
import { inngest,InngestFunctions } from './lib/inngest.js';

const app = express();

app.use(express.json());
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));

app.use("/api/inngest",serve({client: inngest, functions: InngestFunctions}))

app.get("/health",(req,res) => {
    res.status(200).json({msg: "OK"});
})

connectDB()
  .then((conn) => {
    console.log("\n✅ Connected to MongoDB : ", conn.connection.host, conn.connection.name);
    app.listen(ENV.PORT,() => {
        console.log("Server is running on port " + ENV.PORT);
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB ❌", err);
  });