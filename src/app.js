import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// if data is coming from JSON 
app.use(express.json({limit:"15kb"}))

// if data is coming from URL

app.use((express.urlencoded({extended:true,limit:"16kb"}))) // todo study this limit

app.use(express.static("public"))

app.use(cookieParser())





export {app}