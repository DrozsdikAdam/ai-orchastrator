import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import pipelineRoutes from "./routes/pipelineRoutes";
import executionRoutes from "./routes/executionRoutes";
import apiKeyRoutes from "./routes/apiKeyRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
     res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/pipelines", pipelineRoutes);
app.use("/executions", executionRoutes);
app.use("/api-keys", apiKeyRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
     console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
});

export default app;
