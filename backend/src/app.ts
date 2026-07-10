import express from "express";
import authRoutes from "./routes/auth.routes.js";
import caseRoutes from "./routes/case.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Sentinel-X Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

export default app;
