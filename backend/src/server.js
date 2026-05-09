import express from 'express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/database.js';

const app = express();

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