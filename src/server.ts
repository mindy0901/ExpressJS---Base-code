import express from "express";
import http from "http";
import * as dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import chalk from "chalk";

import { credentials } from "./middlewares";
import { corsOptions } from "./config";
import "./types/global";

import authRoute from "./routes/auth";
import userRoute from "./routes/user";

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.development" });
} else {
    dotenv.config({ path: ".env.production" });
}

app.use(logger(":method :url :status"));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// routes
app.use("/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(chalk.green(`Server running on port ${PORT}`));
    console.log(chalk.green(`Server environment: ${process.env.NODE_ENV}`));
});
