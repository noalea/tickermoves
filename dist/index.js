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
const rss_parser_1 = __importDefault(require("rss-parser"));
const RSS_URL = "https://ir.bigbear.ai/news-events/press-releases/rss";
function fetchLatestNews() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parser = new rss_parser_1.default();
            const response = yield axios_1.default.get(RSS_URL);
            const feed = yield parser.parseString(response.data);
            const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
            console.log("TODAY", today);
            feed.items.forEach((item) => {
                console.log('item', item);
                const pubDate = new Date(item.pubDate).toISOString().split("T")[0];
                console.log('pubDate', pubDate);
                if (pubDate === today) {
                    console.log(`Title: ${item.title}`);
                }
            });
        }
        catch (error) {
            console.error("Error fetching or parsing RSS feed:", error.message);
        }
    });
}
fetchLatestNews();
