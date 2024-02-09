const mongoose = require("mongoose")
const priestsDetails = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"priest name is required"]
    },
    lastName:{
        type:String,
        required:[true,"priest name is required"]
    },
    rankInChurch:{
        type:String,
        required:[true,"priest position is required"]

    },
    phoneNumber:{
        type:String
    },
    yearTransferred:{
        type:String,
        required:[true,"location is required"]
    },
 
    station:{
        type:String

    },
    district:{
        type:String

    },
    gender:{
        type:String
    },
    addImage:{
        type:String
    }
},{timestamps:true})

const myPriest = mongoose.model("priestInfo", priestsDetails)
module.exports=myPriest