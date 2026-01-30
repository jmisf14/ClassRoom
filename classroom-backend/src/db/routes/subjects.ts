import express from "express";
import { and, eq, ilike, or, sql, type SQLWrapper } from "drizzle-orm";
import { db } from "../../db.js";
import { departments, subjects } from "../schema/app.js";

const router = express.Router();

//Get all subjects with optional search filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit)

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions: (SQLWrapper | undefined)[] = [];
        if (typeof search === "string" && search.trim().length > 0) {
            const searchCondition = or(
                ilike(subjects.name, `%${search}%`),
                ilike(subjects.code, `%${search}%`),
            );
            filterConditions.push(searchCondition);
        }

        if (typeof department === "string" && department.trim().length > 0) {
            const departmentId = Number(department);
            if (Number.isFinite(departmentId)) {
                filterConditions.push(eq(subjects.departmentId, departmentId));
            }
        }

        const whereClause =
            filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);
        const query = whereClause
            ? db.select().from(subjects).where(whereClause)
            : db.select().from(subjects);

        const data = await query.limit(limitPerPage).offset(offset);
        res.status(200).json({ data, page: currentPage, limit: limitPerPage });

        const totalCount = countResult[0]?.count ?? 0;
    } catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({ error: 'Failed to get subjects' });

    }
});

export default router;