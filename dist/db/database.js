"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor() {
        this.connection = mysql2_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        this.connection.connect((err) => {
            if (err) {
                console.error('Database connection failed:', err);
            }
            else {
                console.log('Connected to MySQL');
            }
        });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    query(query, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    // Close connection method
    close() {
        this.connection.end((err) => {
            if (err) {
                console.error('Error closing MySQL connection:', err);
            }
            else {
                console.log('MySQL connection closed');
            }
        });
    }
}
exports.default = Database;
