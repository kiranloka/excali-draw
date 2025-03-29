import express,{Request,Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config";
import { middleware } from "./middleware";
const app = express();

app.post("/room",middleware,(req:Request,res:Response)=>{
   //db call
   res.json({
    message:"room Id"
   }) 
});

app.post("/signup",(req:Request,res:Response)=>{
//db call
res.json({userId:"123"});

})

app.post("/signin",(req,res)=>{
    const userId=1;
    const token=jwt.sign({userId},JWT_SECRET)
    res.json({token});
})

app.listen(3001,()=>{
    console.log("listening on port 3001")
});
