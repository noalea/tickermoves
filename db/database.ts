import mysql from 'mysql2';
import dotenv from 'dotenv';

import type { Connection } from 'mysql2';

dotenv.config();

export default class Database {
  private static instance: Database;
  private connection: Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    this.connection.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err);
      } else {
        console.log('Connected to MySQL');
      }
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as T[]);
        }
      });
    });
  }

  // Close connection method
  close() {
    this.connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err);
      } else {
        console.log('MySQL connection closed');
      }
    });
  }
}
