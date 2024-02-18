const userModel = require("../Model/model")
require("dotenv").config()
const nodemailer=require("nodemailer")
const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")
const mailSender =require("../Controllers/mail")

// const transporter = nodemailer.createTransport({
//     service: process.env.service,
//     auth: {
//       user: process.env.user,
//       pass: process.env.password
//     }
//   })

exports.signUp =async(req,res)=>{
    try {
        const {firstName,lastName,email,password,phoneNumber}= req.body

        const checkMail =await userModel.findOne({email:email})
        const checkNumber =await userModel.findOne({phoneNumber:phoneNumber})

        const salt =await bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(password,salt)
        const data ={
          firstName,
          lastName,
          email, 
          password:hash,
          phoneNumber
        } 
     if(!firstName||!lastName ||!email||!password||!phoneNumber){
         return res.status(400).json({
            message:"field cant be left empty"
         })            
     
         }else if(checkMail){
            return res.status(300).json({
                message:`this email  ${email} is associated with an account on this platform`
            })

        }else if(checkNumber){
            return res.status(400).json({
                message:"phone number already in use"
            })

        }
        else if(phoneNumber.length !==11){
            return res.status(400).json({
                message: "phone number must be 11 characters"
            })
        }else if(password.length<8){
            return res.status(400).json({
                message:"password must be a minimum of 8 characters and a maximum of 20 characters"
            } )
        }
        const createdUser =await new userModel(data)
        const newToken = jwt.sign({
            email,
            password
        },process.env.JWT_TOKEN,{expiresIn: "1d"})
        createdUser.Token = newToken
        const subject ="ACCOUNT CREATED"
        const link =`${req.protocol}: //${req.get("host")}/welcome on board${createdUser._id}/${newToken}`

     

    
        mailSender(
            {
                from:"gmail",
                email:createdUser.email,
                subject: subject,
                message:"you have successfully created an account with christ holy church"
                
            }
        )
     await createdUser.save()
     res.status(200).json({
         message:" info created and saved successfully",
         data:createdUser
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
                message: "number not registered on this platform"
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
exports.userVerify =async(req,res)=>{
    try {
        const registeredUser = await userModel.findById(req.params.id)
        const registeredToken= registeredUser.Token
        await jwt.verify(registeredToken,process.env.JWT_TOKEN,{expiresIn:"1d"},(err,data)=>{
            if(err){
                return res.status(300).json({
                    message:"this link has expired"
                })
            }else{
                return data
            }
        })
        const verified =await userModel.findByIdAndUpdate(req.params.id,{isVerified:true},)
        if(!verified){
            return res.status(400).json({
                message:"unable to verify user"
            })
        }else{
            return res.status(200).json({
                message:"user has been verified successfully"
            })
        }
        
    } catch (error) {
        return res.status(200).json({
            message:"user has been verified successfully"
        })
       
        
    }
}
exports.resendVerificationEmail = async (req, res) => {
    try {
        const {email} = req.body
        const user = await userModel.findOne( { email: email.toLowerCase()})
        if (!user){
            return res.status(404).json({
                error: "user  not found"
            })
        }
            const token = await jwt.sign( {email: email.toLowerCase()}, process.env.JWT_TOKEN, {expiresIn:"1d"} )
            
           
            const mailOptions = {
                from: process.env.user,
                to: email,
                subject: "Verify your account",
                html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>`,
            }


            await transporter.sendMail(mailOptions)

        res.status(200).json( {
            message: `Verification email sent successfully to your email: ${user.email}`
        })

    } catch(error){
        res.status(500).json({
            message: error.message
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
        const id = req.params.id
        const user =await userModel.findById(id)
        const bin =[]
        const hasAuth = req.headers.authorization
        // const token = hasAuth.split(" ")[1]
        bin.push(hasAuth)
        user.isLoggedin =false
        await user.save()
        return res.status(201).json({
            message:"this user has been logged out successfully",
            data:user.id
        })
    } catch (error) {
        return res.status(500).json({   
            message:error.message
        })
        
    }
}
exports.getallusers = async(req,res)=>{
    try {
        const getAllUsers = await userModel.find()
        if(!getAllUsers){
            return res.status(404).json({
                message:"cannot get all users"
            })
        }else{
            return res.status(200).json({
                message:"here are all the users",
                data:` there are  ${getAllUsers.length} users on the platform`,
                data2:getAllUsers
            })
        }
    } catch (error) {
        return res.status(500).json({   
            message:error.message
        })
    }
}










