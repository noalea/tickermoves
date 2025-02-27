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
const twilio_1 = __importDefault(require("twilio"));
const utils_1 = require("../utils");
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
function notifyUsers(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const tickers = data.related_symbols.map(item => `$${item.split('|')[0].toUpperCase()}`).join(', ');
        const body = `[${tickers}]\n${data.title}\n${(0, utils_1.nasdaqUrl)(data.url)}\n\nWill the price go up based on the news? ${data.analysis}\n\n${data.reasoning}`;
        client.messages
            .create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.MY_PHONE_NUMBER || ''
        })
            .then(message => console.log(`Message sent! ID: ${message.sid}`))
            .catch(error => console.error(error));
    });
}
