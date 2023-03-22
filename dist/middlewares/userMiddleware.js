"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserMiddleware = (req, res, next) => {
    if (req.params.id === "me")
        next("route");
    else
        next();
};
exports.default = getUserMiddleware;
