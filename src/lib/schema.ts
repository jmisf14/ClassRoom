import * as z from "zod";

export const facultySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "teacher", "student"], {
        required_error: "Please select a role",
    }),
    department: z.string().min(1, "Department is required"),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

export const subjectsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    code: z.string().min(2, "Code must be at least 2 characters"),
    description: z.string().optional(),
    // In your UI you currently use department codes like "CS", "Math", etc.
    department: z.string().min(1, "Department is required"),
});

export const scheduleSchema = z.object({
    days: z
        .array(
            z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], {
                required_error: "Please select at least one day",
            }),
        )
        .min(1, "Please select at least one day"),
    startTime: z.string().min(1, "Start time is required"), // e.g. "09:00"
    endTime: z.string().min(1, "End time is required"), // e.g. "10:30"
});

export const classSchema = z.object({
    name: z.string().min(2, "Class name must be at least 2 characters"),
    description: z.string().optional(),
    subjectId: z.coerce.number().int().positive(),
    // joinCode can be generated on the backend, but if you allow manual entry:
    joinCode: z.string().min(4).max(12).optional(),
    bannerImage: z.string().optional(),
    bannerCldPubId: z.string().optional(),
    schedule: scheduleSchema.optional(),
});

export const enrollmentSchema = z.object({
    classId: z.coerce.number().int().positive(),
    studentId: z.coerce.number().int().positive(),
});

