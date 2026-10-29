import express from "express";
import cors from "cors";
import requestLogger from "./middleware/requestLogger";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes"

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes)


app.use(requestLogger);

app.get("/",(req,res)=>{
    res.json({
        sccuess:true,
        message:"backend Running",
    });
});

app.use(errorHandler);

export default app;