//  require('dotenv').config({path: './env'})  but it break the code consistency 

import mongoose from 'mongoose';
// import { DB_NAME } from './constants'; require in method 1
import {app} from './app.js'
import connectDB  from './db/db.js';
import dotenv from "dotenv"

// second method to connect to MONGODB

dotenv.config({
    path:'./env'     // using it as experimental feature
})


connectDB()

.then(()=>{
    app.listen(process.env.PORT|| 8000, () => {
        console.log(`Service is listening at port: ${process.env.PORT}`);
        
    })
})
.catch((error) =>{
    console.log("MONGO db connnection failed  ",error);
    
})





















/* 
import express from 'express'
const app = express()

// iffe method

(async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       
       app.on("error",(error) =>{
        console.log("ERROR: ",error);
        throw error
        
       })

       app.listen(process.env.PORT,() =>{
       console.log(`App is listening on port ${process.env.PORT}`);
        
       })

    }
    catch(error){
        console.log("ERROR: ",error);
        throw error;
    }
})()

// AS a ASYNCHRONOUS SFUNCTION always return with a promise so to handle this we use then and catch method 

.then(()=>{
    app.listen(porcess.env.PORT|| 8000, () => {
        console.log(`Service is listening at ${process.env.PORT}`);
        
    })
})
.catch((error) =>{
    console.log("MONGO db connnection failed  ",err);
    
})

        
*/