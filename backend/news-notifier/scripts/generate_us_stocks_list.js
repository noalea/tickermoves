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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var headers_1 = require("../constants/headers");
var fs = require('fs');
var EXCHANGES = ['nasdaq', 'nyse'];
function fetchUSStocks() {
    return __awaiter(this, void 0, void 0, function () {
        var list_data_1, promises, error_1, err;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    list_data_1 = { "data": [] };
                    promises = EXCHANGES.map(function (exchange) { return __awaiter(_this, void 0, void 0, function () {
                        var url, config, response, data, stocks;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    url = "https://api.nasdaq.com/api/screener/stocks?tableonly=true&exchange=".concat(exchange, "&download=true");
                                    config = {
                                        timeout: 10000,
                                        url: url,
                                        headers: headers_1.headers
                                    };
                                    return [4 /*yield*/, axios_1.default.get(config.url, config)];
                                case 1:
                                    response = _b.sent();
                                    data = response.data;
                                    stocks = ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.rows) || [];
                                    stocks.forEach(function (stock) {
                                        var name = stock.name.replace(/Common Stock|American Depositary Shares|Inc.|American Depository Shares|Common Shares|Class B Ordinary Shares|Ordinary Shares|Class A|Ordinary Share|Units/g, '').replace('  ', ' ');
                                        list_data_1.data.push({
                                            ticker: stock.symbol,
                                            name: removeTrailingSpace(name),
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    fs.writeFileSync('data/us_stocks_list.json', JSON.stringify(list_data_1, null, 2), 'utf-8');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    err = error_1;
                    console.error('Error fetching data:', err.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
fetchUSStocks();
function removeTrailingSpace(str) {
    return str.endsWith(' ') ? str.slice(0, -1) : str;
}
