const mongoose =require("mongoose")

const myInfo = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"]
    },
    lastName:{
        type:String,
        required:[true,"last name is required"]
    },
    email:{
        type:String,
        required:[true,"email is equired"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    confirmPassword:{
        type:String,
        required:[true,"confirm password is reequired"]
    },
    phoneNumber:{
        type:String,
        required:[true,"phone number is required"]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isverified:{
        type:Boolean,
        default:false
    }
})
const myDetails = mongoose.model("users",myInfo)
module.exports = myDetails 