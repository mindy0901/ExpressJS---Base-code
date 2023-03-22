"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv = __importStar(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const chalk_1 = __importDefault(require("chalk"));
const middlewares_1 = require("./middlewares");
const config_1 = require("./config");
require("./types/global");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.development" });
}
else {
    dotenv.config({ path: ".env.production" });
}
app.use((0, morgan_1.default)(":method :url :status"));
app.use(middlewares_1.credentials);
app.use((0, cors_1.default)(config_1.corsOptions));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
// routes
// app.use("/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(chalk_1.default.green(`Server running on port ${PORT}`));
    console.log(chalk_1.default.green(`Server environment: ${process.env.NODE_ENV}`));
});
