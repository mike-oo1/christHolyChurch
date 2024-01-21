const userModel = require("../Model/model")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")
const mailTemp =require("../index")

const mailSender =require("../Controllers/mail")
const {generateDynamicEmail}=require("../Utils/mailTemp")
exports.signUp =async(req,res)=>{
    try {
        const {firstName,lastName,email,password,confirmPassword,phoneNumber}= req.body

        const checkMail =await userModel.findOne({email:email})

        const salt =await bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(password,salt)
        const data ={
          firstName,
          lastName,
          email,
          password:hash,
          confirmPassword:hash,
          phoneNumber
        }
     if(!firstName||!lastName ||!email||!password||!confirmPassword,!phoneNumber){
         return res.status(400).json({
            message:"field cant be left empty"
           
         })            
     
        //  }else if(checkMail){
        //     return res.status(300).json({
        //         message:`this email  ${email} is associated with an account on this platform`
        //     })
        }else if(confirmPassword!==password){
            return res.status(300).json({
                message:"password does not match"
            })

        }else if(phoneNumber.length < 6 || phoneNumber.length>14 ){
            return res.status(400).json({
                message: "phone number must be a min of 6 and a max 0f 14"
            })
        }else if(password.length<8||password.length>20){
            return res.status(400).json( {
                message:"password must be a minimum of 8 characters and a maximum of 20 characters"
            } )
        }
        const createUser =await new userModel(data)
        // generate the token

        const newToken = jwt.sign({
            email,
            password
        },process.env.JWT_TOKEN,{expiresIn: "1d"})
        createUser.Token = newToken
        const subject ="KINDLY VERIFY BRO"
        const link =`${req.protocol}: //${req.get("host")}/userverify${createUser._id}/${newToken}`
        const message =`click on this link${link} to verify, kindly note that this link will expire after 5 minutes`
        msg = await generateDynamicEmail()
        mailSender(
            {
                from:"gmail",
                email:createUser.email,
                subject:`kindly verify`,
                message:msg
            }
        )
    
    
     await createUser.save()
     res.status(200).json({
         message:"created",
         message:"please click on this link to navigate you to the login page",
         data:createUser
     })
    
    
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}


exports.signin= async(req,res)=>{
    try {
        const {password,phoneNumber}=req.body
        const checkNumber = await userModel.findOne({phoneNumber:phoneNumber})
        
         if(!checkNumber){
            return res.status(300).json({
                message: "wrong phone number  format"
            })
        }
        const checkPassword = await bcrypt.compare(password,checkNumber.password)
        if(!checkPassword){
            return res.status(300).json({
                message:"wrong password"
            })
        }else{
            const createToken =jwt.sign({
                 
                phoneNumber,
                password
            },process.env.JWT_TOKEN,{expiresIn :"1d"})
            checkNumber.Token =createToken
            await checkNumber.save()
            return res.status(201).json({
                status:"successful",
                message:`${checkNumber.firstName}  your log in is successful`,
                data:checkNumber
            })
        } 

    
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
exports.changePassword =async(req,res)=>{
    try {
        const {password}=req.body
        const id =req.params.id
        const salt =await bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(password,salt)
        const resetDetails ={
            password:hash
        }
        const resetResult = await userModel.findByIdAndUpdate(id,resetDetails,{password:hash},
            {new:true})
        if(!resetResult){
            return res.status(400).json({
                message:"unable to change your password"
            })
        }else{
        return res.status(201).json({
            message:"password changed successfully",
            data:resetDetails.password
        })
           
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.signOut= async(req,res)=>{
    try {
        const user =await userModel.findById(req.user._id)
        const bin =[]
        const hasAuth = req.headers.authorization
        const token = hasAuth.split(" ")[1]
        bin.push(token)
        user.isLoggedin =false
        await user.save()
        return res.status(201).json({
            message:"this user has been logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({   
            message:error.message
        })
        
    }
}
