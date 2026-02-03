import express from "express";
import cors from "cors";
import subjectsRouter from "./db/routes/subjects.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            process.env.FRONTEND_URL,
        ].filter(Boolean) as string[],
        credentials: true,
    }),
);

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).send("Classroom backend is running.");
});

// OpenAPI schema for Refine Dev / Swagger tooling
app.get("/openapi.json", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../openapi.json"));
});

app.use("/api/subjects", subjectsRouter);

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});

