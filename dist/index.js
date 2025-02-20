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
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("./db/database"));
const constants_1 = require("./constants");
const db_1 = require("./db");
const ai_1 = require("./ai");
const utils_1 = require("./utils");
// Job that runs every 5 minutes
// Go through nasdaq.com press releases
// Find new ones (haven't been recorded yet)
// Ask AI if likely or not to go up
// Record data
// Notify user
function fetchLatestPressReleases() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const url = 'https://www.nasdaq.com/api/news/topic/press_release';
            const { data } = yield axios_1.default.get(url, { headers: constants_1.headers });
            const news = ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.rows) || [];
            for (const article of news) {
                // Skip articles without tagged tickers
                if (!article.related_symbols.length) {
                    continue;
                }
                const isNewArticle = yield (0, db_1.isNewRelease)(article);
                if (isNewArticle) {
                    // get ai analysis
                    const url = (0, utils_1.nasdaqUrl)(article.url);
                    const ticker = article.related_symbols[0].replace(/\|stocks/g, '');
                    const analysis = yield (0, ai_1.analyzePressRelease)({ url, ticker });
                    // add to db
                    yield (0, db_1.recordRelease)(Object.assign(Object.assign({}, article), analysis));
                    // notify user
                }
                else {
                    // do nothing
                    continue;
                }
            }
            ;
            const db = database_1.default.getInstance();
            db.close();
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    });
}
fetchLatestPressReleases();
