import { NextFunction, Request, Response } from "express";

const getUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id === "me") next("route");
    else next();
};

export default getUserMiddleware;
