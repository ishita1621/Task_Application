import type {Request, Response, NextFunction} from "express";

const requestLogger=(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const startTime= Date.now();

    res.on("finish",()=>{
        const duration=Date.now()-startTime;

        console.log(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );
    });
    next();
};

export default requestLogger;