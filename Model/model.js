const mongoose =require("mongoose")

const myInfo = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isverified:{
        type:Boolean,
        default:false
    },
    Token:{
        type:String
    }
})
const myDetails = mongoose.model("users",myInfo)
module.exports = myDetails 