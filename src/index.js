import mongoose from 'mongoose';
import { DB_NAME } from './constants';

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
        
