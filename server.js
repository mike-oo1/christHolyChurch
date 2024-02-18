const express =require("express")
const mongoose =require("mongoose")
const dotenv =require("dotenv")
dotenv.configDotenv({path:"./config.env"})

const cors=require("cors")
require ("dotenv").config()
const route= require("./Router/route")
const app = express()
app.use(express.json()) 
app.use(cors({
    origin: '*', 
    methods: ["GET"]
}))
app.use(express.urlencoded({extended:true}))
app.use("/api",route)
app.use("/priestsImage", express.static(__dirname + "/priestsImage"))

const PORT = process.env.PORT
const DB = process.env.DATABASE
console.log(DB)
mongoose.connect(DB)
.then(()=>{
    console.log(`database connected successfully to ${DB}`)
}).catch((error)=>{
    console.log(error.message)
}) 
app.listen(process.env.PORT||8000,()=>{ 
    console.log(`server is listening to port ${PORT}`)
})
 



