import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

function normalizeDatabaseUrl(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    let value = raw.trim();

    // Allow pasting a full psql command like: psql 'postgresql://...'
    if (value.startsWith("psql")) {
        // Extract first quoted string (single or double)
        const match = value.match(/psql\s+(['"])([\s\S]+?)\1/);
        if (match?.[2]) value = match[2].trim();
        else value = value.replace(/^psql\s+/, "").trim();
    }

    // Strip surrounding quotes if present
    if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
    ) {
        value = value.slice(1, -1).trim();
    }

    return value;
}

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL is not set. Add it to classroom-backend/.env or classroom-backend/.env.local (or export it in your shell).",
    );
}

let dbUrl: URL;
try {
    dbUrl = new URL(databaseUrl);
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
    connectionString: databaseUrl,
});

export const db = drizzle(pool);

