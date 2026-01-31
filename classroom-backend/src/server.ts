import express from "express";
import subjectsRouter from "./db/routes/subjects.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).send("Classroom backend is running.");
});

app.use("/api/subjects", subjectsRouter);

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});

