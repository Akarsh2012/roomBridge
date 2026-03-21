import express from "express";
import cors from "cors";
import moduleRouter from "./modules/router";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "RoomBridge API is running" });
});

// All module routes under /api
app.use("/api", moduleRouter);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
