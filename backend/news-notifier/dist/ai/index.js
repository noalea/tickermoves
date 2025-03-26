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
exports.analyzePressRelease = analyzePressRelease;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
dotenv_1.default.config();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
function analyzePressRelease(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, ticker }) {
        var _b, _c, _d, _e;
        let browser = null;
        try {
            // Fetch press release content
            browser = yield puppeteer_1.default.launch(utils_1.puppeteerLaunchOptions);
            const page = yield browser.newPage();
            // Navigate to the desired web page
            yield page.setUserAgent(constants_1.headers["User-Agent"]);
            yield page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });
            const articleText = yield page.evaluate(() => {
                var _a, _b;
                return (_b = (_a = document.querySelector('article')) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.trim();
            });
            yield browser.close();
            browser = null;
            // Ask OpenAI for analysis
            const prompt = `
      Here's a press release:
      """${articleText}"""

      Do you think this press release will make the stock ${ticker} go up?
      Answer with "Most Likely", "Likely", "Unsure", or "Unlikely" and provide a short reasoning.
      Respond in the following JSON format:
      {
        "analysis": "'Most Likely', 'Likely', 'Unsure', or 'Unlikely'",
        "reasoning": "Short explanation"
      }
    `;
            const aiResponse = yield openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: "You are a financial analyst." }, { role: "user", content: prompt }],
                temperature: 0.5,
            });
            return JSON.parse(((_e = (_d = (_c = (_b = aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.replace(/```json|```/g, '')) === null || _e === void 0 ? void 0 : _e.trim()) || '');
        }
        catch (error) {
            console.error("Error analyzing press release: ", error);
            return { analysis: '', reasoning: '' };
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
        }
    });
}
