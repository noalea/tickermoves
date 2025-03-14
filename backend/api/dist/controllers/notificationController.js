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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeviceToken = void 0;
const notificationService_1 = require("../services/notificationService");
const utils_1 = require("../utils");
const saveDeviceToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, utils_1.validateApiKey)(req.query.apiKey, res)) {
        return;
    }
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({ success: false, message: "Token is required" });
        }
        yield (0, notificationService_1.storeDeviceToken)(token);
        res.json({ success: true, data: { token } });
    }
    catch (error) {
        console.error("Error fetching press releases:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.saveDeviceToken = saveDeviceToken;
