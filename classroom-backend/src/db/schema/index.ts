export * from './app.js';


if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL as string);
export const db = drizzle(sql);
