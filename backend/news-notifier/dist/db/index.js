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
exports.isNewRelease = isNewRelease;
exports.recordRelease = recordRelease;
exports.grabNotificationTokens = grabNotificationTokens;
const database_1 = __importDefault(require("./database"));
const utils_1 = require("../utils");
function isNewRelease(article) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = database_1.default.getInstance();
        try {
            const results = yield db.query("SELECT * FROM releases WHERE url = ? OR title = ?", [(0, utils_1.nasdaqUrl)(article.url), article.title]);
            return !results.length;
        }
        catch (error) {
            console.error('Database error:', error);
        }
        return false;
    });
}
function recordRelease(article) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = database_1.default.getInstance();
        try {
            const url = (0, utils_1.nasdaqUrl)(article.url);
            const created = (0, utils_1.getCurrentTimestamp)();
            const tickers = article.related_symbols.toString().replace(/\|stocks/g, '');
            yield db.query("INSERT INTO releases (tickers, title, url, created, analysis, analysis_reasoning) VALUES (?, ?, ?, ?, ?, ?)", [tickers, article.title, url, created, article.analysis, article.reasoning]);
        }
        catch (error) {
            console.error('Database error:', error);
        }
    });
}
function grabNotificationTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = database_1.default.getInstance();
        try {
            const results = yield db.query("SELECT token from notification_tokens");
            return results === null || results === void 0 ? void 0 : results.map(t => t.token);
        }
        catch (error) {
            console.error('Database error:', error);
        }
    });
}
