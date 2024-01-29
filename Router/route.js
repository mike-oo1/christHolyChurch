const express =require("express")
const uploads =require("../Utils/multer")
const cloudinary =require("../Utils/cloudinary")
const {isAdminAuthorized}=require("../Middleware/authorization")

const {signUp,signin,signOut,changePassword,getallusers,userVerify,resendVerificationEmail}=require("../Controllers/controller")
const{newPriest,getAllPriest,getOnePriest,updatePriest,deletePriest}=require("../Controllers/priests")
const Router = express()


Router.route("/signup").post(signUp)
Router.route("/signin").post(signin)



Router.route("/signout/:id").post(signOut)
Router.route("/changepass/:id").put(changePassword)
Router.route("/getallusers").get(getallusers)
Router.route("/userverify/:id/:token").put(userVerify)
Router.route("/re-verify/:id/:token").put(resendVerificationEmail)

Router.route("/newpriest").post(uploads.single("addImage"),newPriest)
Router.route("/getall").get(isAdminAuthorized,getAllPriest)
Router.route("/getone/:id").get(isAdminAuthorized,getOnePriest)
Router.route("/update/:id").put(updatePriest)
Router.route("/delete/:id").delete(isAdminAuthorized,deletePriest)




module.exports =Router 