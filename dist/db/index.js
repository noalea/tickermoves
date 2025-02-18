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
const database_1 = __importDefault(require("./database"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
function isNewRelease(article) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('article', article);
        const db = database_1.default.getInstance();
        try {
            const results = yield db.query("SELECT * FROM releases WHERE url = ?", [article.url]);
            console.log('Results', results);
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
            const url = `${constants_1.nasdaqHost}${article.url}`;
            const created = (0, utils_1.getCurrentTimestamp)();
            const tickers = article.related_symbols.toString().replace(/\|stocks/g, '');
            const id = yield db.query("INSERT INTO releases (tickers, title, url, created) VALUES (?, ?, ?, ?)", [tickers, article.title, url, created]);
            console.log('Inserted', id);
        }
        catch (error) {
            console.error('Database error:', error);
        }
    });
}
