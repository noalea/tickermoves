"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPressReleases = void 0;
const db_1 = __importDefault(require("../config/db"));
const fetchPressReleases = (limit, page) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    const query = `
        SELECT *
        FROM releases
        ORDER BY created DESC
        LIMIT ? OFFSET ?;
    `;
    const countQuery = `SELECT COUNT(*) as total FROM releases;`;
    // Execute queries
    const [pressReleases] = yield db_1.default.query(query, [limit, offset]);
    const [countRows] = yield db_1.default.query(countQuery);
    // Safely extract total count
    const total = (countRows === null || countRows === void 0 ? void 0 : countRows[0]).total || 0;
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: pressReleases,
    };
});
exports.fetchPressReleases = fetchPressReleases;
