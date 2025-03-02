"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pressReleaseController_1 = require("../controllers/pressReleaseController");
const router = express_1.default.Router();
router.get("/", pressReleaseController_1.getPressReleases); // Fetch press releases
exports.default = router;
