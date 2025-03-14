"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTimestamp = getCurrentTimestamp;
exports.validateApiKey = validateApiKey;
const date_fns_tz_1 = require("date-fns-tz");
const constants_1 = require("../constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getCurrentTimestamp() {
    const now = new Date();
    const estDate = (0, date_fns_tz_1.toZonedTime)(now, constants_1.estTimeZone);
    return (0, date_fns_tz_1.format)(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: constants_1.estTimeZone });
}
function validateApiKey(apiKey, res) {
    if (apiKey !== process.env.API_KEY) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return false;
    }
    return true;
}
