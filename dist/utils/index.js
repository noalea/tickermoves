"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTimestamp = getCurrentTimestamp;
const date_fns_tz_1 = require("date-fns-tz");
const constants_1 = require("../constants");
function getCurrentTimestamp() {
    const now = new Date();
    const estDate = (0, date_fns_tz_1.toZonedTime)(now, constants_1.estTimeZone);
    return (0, date_fns_tz_1.format)(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: constants_1.estTimeZone });
}
