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
exports.getPressReleases = void 0;
const pressReleaseService_1 = require("../services/pressReleaseService");
const getPressReleases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const pressReleases = yield (0, pressReleaseService_1.fetchPressReleases)(limit, page);
        res.json(Object.assign({ success: true }, pressReleases));
    }
    catch (error) {
        console.error("Error fetching press releases:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getPressReleases = getPressReleases;
