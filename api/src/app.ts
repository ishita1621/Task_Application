import express from "express";
import cors from "cors";
import requestLogger from "./middleware/requestLogger";
import errorHandler from "./middleware/errorHandler";

const app=express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/",(req,res)=>{
    res.json({
        sccuess:true,
        message:"backend Running",
    });
});

// app.get("/error-test", (req, res, next) => {
//   next(new Error("Testing centralized error handling"));
// });

app.use(errorHandler);

export default app;