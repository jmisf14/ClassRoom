import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is not set. Add it to classroom-backend/.env or classroom-backend/.env.local (or export it in your shell).",
    );
}

let dbUrl: URL;
try {
    dbUrl = new URL(process.env.DATABASE_URL);
} catch {
    throw new Error(
        'DATABASE_URL is not a valid URL. It should look like: postgresql://user:pass@host/db?sslmode=require',
    );
}

if (
    dbUrl.hostname === "base" ||
    dbUrl.hostname.includes("[") ||
    dbUrl.hostname.includes("neon_hostname")
) {
    throw new Error(
        `DATABASE_URL hostname looks wrong ("${dbUrl.hostname}"). Paste the exact Neon connection string from Neon Console → Connect.`,
    );
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

