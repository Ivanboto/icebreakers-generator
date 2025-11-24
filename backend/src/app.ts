import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health/health.routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
