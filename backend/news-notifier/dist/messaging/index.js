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
exports.notifyUsers = notifyUsers;
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
const db_1 = require("../db");
const utils_1 = require("../utils");
dotenv_1.default.config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
});
/**
 * Sends a push notification to multiple users.
 * @param data - Nasdaq article and analysis object.
 * @returns Promise with success or error message.
 */
function notifyUsers(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokens = yield (0, db_1.grabNotificationTokens)();
            if (tokens === null || tokens === void 0 ? void 0 : tokens.length) {
                const tickers = data.related_symbols
                    .map(item => `#${item.split('|')[0].toUpperCase()}`)
                    .join(' ');
                const { url, title, created, ago, analysis, reasoning } = data;
                const message = {
                    notification: { title: tickers, body: data.title },
                    data: {
                        url: (0, utils_1.nasdaqUrl)(url),
                        tickers,
                        title,
                        created,
                        ago,
                        analysis,
                        reasoning
                    },
                    tokens,
                };
                const response = yield firebase_admin_1.default.messaging().sendEachForMulticast(message);
                // Log failed tokens
                const failedTokens = tokens.filter((_, index) => response.responses[index].error);
                if (failedTokens.length) {
                    console.error('Failed tokens:', failedTokens);
                }
                return { success: true, message: 'Notifications sent successfully', failedTokens };
            }
            return { success: false, message: 'Failed to grab tokens from database' };
        }
        catch (error) {
            console.error('Error sending notification:', error);
            return { success: false, message: 'Failed to send notifications', error };
        }
    });
}
