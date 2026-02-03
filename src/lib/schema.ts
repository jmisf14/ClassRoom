import * as z from "zod"; 

export const facultySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    emails: z.string().email(),
    role: z.enum(['admin', 'teacher', 'student']),
    department: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
})

