import express from "express";

const router = express.Router();

// Minimal in-memory teachers list (until we add a DB table)
const teachers = [
    { id: 1, name: "Dr. Rivera" },
    { id: 2, name: "Prof. Ahmed" },
    { id: 3, name: "Ms. Chen" },
];

router.get("/", (_req, res) => {
    res.status(200).json({ data: teachers });
});

export default router;

