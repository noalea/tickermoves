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
exports.storeDeviceToken = void 0;
const db_1 = __importDefault(require("../config/db"));
const utils_1 = require("../utils");
const storeDeviceToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT IGNORE INTO notification_tokens (token, created) VALUES (?, ?);`;
    const timeNow = (0, utils_1.getCurrentTimestamp)();
    // Execute queries
    yield db_1.default.query(query, [token, timeNow]);
});
exports.storeDeviceToken = storeDeviceToken;
