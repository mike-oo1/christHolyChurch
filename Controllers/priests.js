const myPriest=require("../Model/priestsModel")
const cloudinary = require("cloudinary")


exports.newPriest = async ( req, res ) => {
    try {
        const{fullName,rankInChurch,phoneNumber,yearTransferred,yearLivingTransferred,selectStation,selectDistrict,gender}=req.body
      
        console.log(req.body);
        const data ={
            fullName,
            rankInChurch,
            phoneNumber,
            yearTransferred,
            yearLivingTransferred,
            selectStation,
            selectDistrict,
            gender,
            addImage:req.file.path
        }
        // console.log(req.file);
        
        
        let result = null
        if(req.file){
           result = await cloudinary.uploader.upload(req.file.path)
        }
        

        const priestInfo = new myPriest({
            fullName,
            rankInChurch,
            phoneNumber, 
            yearTransferred,
            yearLivingTransferred,
            selectStation,
            selectDistrict,
            gender,
            addImage:result?.secure_url
                })
        // console.log(result);
        if(!fullName||!rankInChurch||!phoneNumber||!yearTransferred||!yearLivingTransferred||!selectStation||!selectDistrict||!gender){
            return res.status(300).json({
                message:`field  cannot be left empty`
            })

        }else if(phoneNumber.length<11){
            return res.status(400).json({
                message:"phone number should be a minimum of 11 characters"
            })

        }

    
       
            else if ( priestInfo ) {
                await priestInfo.save()
                res.status( 201 ).json( {
                    message: "priest data saved successfully",
                    data: data, 
                    data: priestInfo
                })
            } else {
                res.status( 400 ).json( { 
                    message: "Could not create priest data"
                })
            }

        
        // console.log(req.file)

    } catch (err) {
        res.status( 500 ).json( {
            message: err.message
        })
    }
}


exports.getAllPriest = async(req,res)=>{
    try {
        const getAllPriests=await myPriest.find()
        if(!getAllPriests){
            return res.status(404).json({
                message:"no data available"
            })
        }else{
            return res.status(200).json({
                message:"here are the info of all priests",
                data:getAllPriests.length,
                data:getAllPriests
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message

        })
        
    }
} 
exports.getOnePriest =async(req,res)=>{
    try {
        const id =req.params.id
        const getOne = await myPriest.findById(id)
        if(!getOne){
            return res.status(404).json({
                message:`priest with id ${id},is not found`
            })
        }else{
            return res.status(200).json({ 
                message:`here is the priest with id ${id}`,
                data:getOne
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message

        })
    }
}

exports.updatePriest = async(req,res)=>{
    try {
        const id = req.params.id
        const updatePriest =await myPriest.findByIdAndUpdate(id,{new:true}) 
        if(!updatePriest){
            return res.status(400).json({
                message:`cannot update prist with id ${id}`
            })
        }else{
            updatePriest.save()
            
            return res.status(201).json({
                message:`priest with id ${id} has ben updated successfully,${update}`,
                data:updatePriest
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            message:error.message

        })
    }
}

exports.deletePriest=async(req,res)=>{
    try {
        const id = req.params.id
        const deletePriest= await myPriest.findByIdAndDelete(id)
        if(!deletePriest){
            return res.status(404).json({
                message:`priest wit id ${id}  cannot be deleted`
            })
        }else{
            return res.status (200).json({
                message:`priest with id${id} deleted successfully`,
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message

        })
    }
}