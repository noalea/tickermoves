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
const axios_1 = __importDefault(require("axios"));
const headers_1 = require("../constants/headers");
const fs = require('fs');
const EXCHANGES = ['nasdaq', 'nyse'];
function fetchUSStocks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const list_data = { "data": [] };
            const promises = EXCHANGES.map((exchange) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const url = `https://api.nasdaq.com/api/screener/stocks?tableonly=true&exchange=${exchange}&download=true`;
                let config = {
                    timeout: 10000,
                    url,
                    headers: headers_1.headers
                };
                const response = yield axios_1.default.get(config.url, config);
                const data = response.data;
                // Extract stock list
                const stocks = ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.rows) || [];
                stocks.forEach((stock) => {
                    const name = stock.name.replace(/Common Stock|American Depositary Shares|Inc.|American Depository Shares|Common Shares|Class B Ordinary Shares|Ordinary Shares|Class A|Ordinary Share|Units/g, '').replace('  ', ' ');
                    list_data.data.push({
                        ticker: stock.symbol,
                        name: removeTrailingSpace(name),
                    });
                });
            }));
            yield Promise.all(promises);
            fs.writeFileSync('data/us_stocks_list.json', JSON.stringify(list_data, null, 2), 'utf-8');
        }
        catch (error) {
            const err = error;
            console.error('Error fetching data:', err.message);
        }
    });
}
fetchUSStocks();
function removeTrailingSpace(str) {
    return str.endsWith(' ') ? str.slice(0, -1) : str;
}
