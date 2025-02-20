"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const constants_1 = require("../constants");
dotenv_1.default.config();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
function analyzePressRelease(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, ticker }) {
        var _b, _c, _d, _e;
        try {
            // Fetch press release content
            const response = yield (0, node_fetch_1.default)(url, { headers: constants_1.headers });
            if (!response.ok)
                throw new Error("Failed to fetch the press release");
            const text = yield response.text();
            const $ = cheerio.load(text);
            const articleText = $('article').text();
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
    });
}
