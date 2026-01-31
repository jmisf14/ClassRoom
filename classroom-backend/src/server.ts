import express from "express";
import subjectsRouter from "./db/routes/subjects.js"; 

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Classroom backend is running.");
});

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});

