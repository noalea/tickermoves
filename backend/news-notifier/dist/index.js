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
const puppeteer_1 = __importDefault(require("puppeteer"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const database_1 = __importDefault(require("./db/database"));
const constants_1 = require("./constants");
const db_1 = require("./db");
const ai_1 = require("./ai");
const utils_1 = require("./utils");
const messaging_1 = require("./messaging");
// Job that runs every 5 minutes
// Go through nasdaq.com press releases
// Find new ones (haven't been recorded yet)
// Ask AI if likely or not to go up
// Record data
// Notify user
function fetchLatestPressReleases() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log('Memory usage at start:', process.memoryUsage());
        const db = database_1.default.getInstance();
        let browser = null;
        try {
            const url = 'https://www.nasdaq.com/api/news/topic/press_release';
            browser = yield puppeteer_1.default.launch(utils_1.puppeteerLaunchOptions);
            const page = yield browser.newPage();
            // Navigate to the desired web page
            yield page.setUserAgent(constants_1.headers["User-Agent"]);
            yield page.goto(url);
            const data = yield page.evaluate(() => {
                return document.body.innerText;
            });
            yield browser.close();
            browser = null;
            const news = ((_b = (_a = JSON.parse(data)) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.rows) || [];
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
                    yield (0, messaging_1.notifyUsers)(Object.assign(Object.assign({}, article), analysis));
                }
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            // Always close browser if it's still open
            if (browser) {
                try {
                    yield browser.close();
                }
                catch (err) {
                    console.error("Error closing browser:", err);
                }
            }
            // Always close database connection
            try {
                db.close();
            }
            catch (err) {
                console.error("Error closing database connection:", err);
            }
        }
    });
}
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Close Firebase Admin app
            yield firebase_admin_1.default.app().delete();
            console.log('Firebase Admin app closed');
        }
        catch (error) {
            console.error('Error closing Firebase Admin app:', error);
        }
    });
}
fetchLatestPressReleases()
    .then(cleanup)
    .then(() => {
    console.log('Memory usage at end:', process.memoryUsage());
    // Give time for connections to close properly
    setTimeout(() => {
        process.exit(0);
    }, 1000);
})
    .catch(error => {
    console.error("Unhandled error:", error);
    cleanup().finally(() => {
        process.exit(1);
    });
});
