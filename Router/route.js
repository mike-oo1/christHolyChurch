const express =require("express")
const uploads =require("../Utils/multer")
const cloudinary =require("../Utils/cloudinary")
const {isAdminAuthorized}=require("../Middleware/authorization")

const {signUp,signin,signOut,changePassword}=require("../Controllers/controller")
const{newPriest,getAllPriest,getOnePriest,updatePriest,deletePriest}=require("../Controllers/priests")
const Router = express()
Router.route("/signup").post(signUp)
Router.route("/signin").post(signin)
Router.route("/signout/:id").post(signOut)
Router.route("/changepass/:id").put(changePassword)


Router.route("/newpriest").post(uploads.single("addImage"),newPriest)
Router.route("/getall").get(getAllPriest)
Router.route("/getone/:id").get(getOnePriest)
Router.route("/update/:id").put(updatePriest)
Router.route("/delete/:id").delete(deletePriest)




module.exports =Router