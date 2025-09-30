import mysql from 'mysql2/promise';
import type { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gleam_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = {
  query: <T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    params?: any[]
  ): Promise<[T, FieldPacket[]]> => {
    return pool.execute<T>(sql, params);
  },
};
