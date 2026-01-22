import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load env from either file:
// - .env (common)
// - .env.local (often preferred for local dev and avoids some editor restrictions)
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

// Common broken/placeholder cases that lead to: getaddrinfo ENOTFOUND base
if (
    dbUrl.hostname === "base" ||
    dbUrl.hostname === "..." ||
    dbUrl.hostname.includes("...") ||
    dbUrl.hostname.includes("[") ||
    dbUrl.hostname.includes("neon_hostname")
) {
    throw new Error(
        `DATABASE_URL hostname looks wrong ("${dbUrl.hostname}"). Paste the exact Neon connection string from Neon Console → Connect.`,
    );
}

// Helpful guardrails for Neon URLs (avoid false positives for local Postgres)
if (dbUrl.hostname !== "localhost" && !dbUrl.hostname.endsWith(".neon.tech")) {
    throw new Error(
        `DATABASE_URL hostname does not look like Neon ("${dbUrl.hostname}"). It should usually end with ".neon.tech". Paste the exact Neon connection string from Neon Console → Connect.`,
    );
}

export default defineConfig({
    schema: "./src/db/schema/app.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});

