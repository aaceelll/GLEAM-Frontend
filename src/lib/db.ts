// src/lib/db.ts
import mysql, { Pool, PoolOptions } from "mysql2/promise";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";

/**
 * Ambil konfigurasi koneksi dari ENV.
 * - Prioritaskan DATABASE_URL (mysql://user:pass@host:3306/dbname?ssl=true)
 * - Jika tidak ada, pakai DB_HOST/DB_USER/DB_PASSWORD/DB_NAME/DB_PORT/DB_SSL
 */
function makePoolConfig(): string | PoolOptions {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = Number(process.env.DB_PORT || 3306);
  const sslEnabled = String(process.env.DB_SSL || "").toLowerCase() === "true";

  if (!host || !user || !database) {
    throw new Error(
      "Missing DB env. Set DATABASE_URL atau DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (opsional DB_PORT, DB_SSL)."
    );
  }

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl: sslEnabled ? { rejectUnauthorized: true } : undefined,
  };
}

// --- Singleton pool agar tidak membuat koneksi berulang di dev/serverless ---
declare global {
  // eslint-disable-next-line no-var
  var __MYSQL_POOL__: Pool | undefined;
}

function getPool(): Pool {
  if (!global.__MYSQL_POOL__) {
    const cfg = makePoolConfig();
    global.__MYSQL_POOL__ =
      typeof cfg === "string" ? mysql.createPool(cfg) : mysql.createPool(cfg);
  }
  return global.__MYSQL_POOL__!;
}

const pool = getPool();

// Opsional: sanity check di startup (log kalau gagal)
(async () => {
  try {
    const c = await pool.getConnection();
    await c.ping();
    c.release();
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ DB ping OK");
    }
  } catch (e) {
    console.error("❌ DB ping failed:", e);
  }
})();

export const db = {
  query: <T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    params?: any[]
  ): Promise<[T, FieldPacket[]]> => {
    return pool.execute<T>(sql, params);
  },
};
