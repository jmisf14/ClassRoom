import express from "express";

const router = express.Router();

type ClassStatus = "active" | "inactive";
type ClassRecord = {
    id: number;
    name: string;
    subjectId: number;
    teacherId: number;
    capacity: number;
    status: ClassStatus;
    description?: string;
    bannerImage?: string;
};

let nextId = 1;
const classes: ClassRecord[] = [];

router.get("/", (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.max(1, Number(limit) || 10);
    const offset = (currentPage - 1) * limitPerPage;

    const data = classes.slice(offset, offset + limitPerPage);
    res.status(200).json({
        data,
        pagination: {
            page: currentPage,
            limit: limitPerPage,
            total: classes.length,
            totalPages: Math.max(1, Math.ceil(classes.length / limitPerPage)),
        },
    });
});

router.post("/", (req, res) => {
    const {
        name,
        subjectId,
        teacherId,
        capacity,
        status,
        description,
        bannerImage,
    } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({ error: "name is required" });
    }
    const subjectIdNum = Number(subjectId);
    const teacherIdNum = Number(teacherId);
    const capacityNum = Number(capacity);
    const statusVal: ClassStatus = status === "inactive" ? "inactive" : "active";

    if (!Number.isFinite(subjectIdNum) || subjectIdNum <= 0) {
        return res.status(400).json({ error: "subjectId is required" });
    }
    if (!Number.isFinite(teacherIdNum) || teacherIdNum <= 0) {
        return res.status(400).json({ error: "teacherId is required" });
    }
    if (!Number.isFinite(capacityNum) || capacityNum <= 0) {
        return res.status(400).json({ error: "capacity is required" });
    }

    const record: ClassRecord = {
        id: nextId++,
        name: name.trim(),
        subjectId: subjectIdNum,
        teacherId: teacherIdNum,
        capacity: capacityNum,
        status: statusVal,
        ...(typeof description === "string" && description.trim().length > 0
            ? { description: description.trim() }
            : {}),
        ...(typeof bannerImage === "string" && bannerImage.trim().length > 0
            ? { bannerImage: bannerImage.trim() }
            : {}),
    };

    classes.unshift(record);
    return res.status(201).json({ data: record });
});

export default router;

