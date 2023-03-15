"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const credentials_1 = __importDefault(require("./middlewares/credentials"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, morgan_1.default)(":method :url :status"));
app.use(credentials_1.default);
app.use((0, cors_1.default)(corsOptions_1.default));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
// routes
// app.use("/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
