"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerLaunchOptions = exports.isProduction = void 0;
exports.getCurrentTimestamp = getCurrentTimestamp;
exports.nasdaqUrl = nasdaqUrl;
const date_fns_tz_1 = require("date-fns-tz");
const constants_1 = require("../constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getCurrentTimestamp() {
    const now = new Date();
    const estDate = (0, date_fns_tz_1.toZonedTime)(now, constants_1.estTimeZone);
    return (0, date_fns_tz_1.format)(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: constants_1.estTimeZone });
}
function nasdaqUrl(url) {
    return `${constants_1.nasdaqHost}${url}`;
}
exports.isProduction = process.env.ENVIRONMENT === 'production';
exports.puppeteerLaunchOptions = exports.isProduction ? {
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox']
} : undefined;
