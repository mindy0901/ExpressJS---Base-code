"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.allowedOrigins = void 0;
const allowedOrigins_1 = __importDefault(require("./allowedOrigins"));
exports.allowedOrigins = allowedOrigins_1.default;
const corsOptions_1 = __importDefault(require("./corsOptions"));
exports.corsOptions = corsOptions_1.default;
