"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = camelize;
const lodash_1 = require("lodash");
function camelize(obj) {
    return (0, lodash_1.transform)(obj, (result, value, key, target) => {
        const camelKey = (0, lodash_1.isArray)(target) ? key : (0, lodash_1.camelCase)(key);
        // Use type assertion to ensure `result` maintains `T`'s structure
        result[camelKey] = (0, lodash_1.isObject)(value) ? camelize(value) : value;
    }, {});
}
