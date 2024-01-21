const jwt = require("jsonwebtoken")
const User = require("../Model/model")
const dotenv = require("dotenv")
dotenv.config()

const userAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
        const hasAuthorization = req.headers.authorization
      const token = hasAuthorization.split(" ")[1]

      const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN);
      console.log(decodedToken)
      req.user = JSON.stringify(decodedToken)
      req.userId = decodedToken.userId
     
      next()
    } else {
      res.status(404).json({
        message: "No authorization found",
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const isAdminAuthorized = async (req, res, next) => {
  try {
console.log(req.userId)
    const user = await User.findById(req.userId)
    console.log(user)
    if (user.isAdminAuthorized) {
      next()
    } else {
      res.status(401).json({ message: "not an admin" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const isSuperAdminAuthorized = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.isSuperAdmin) {
      next()
    } else {
      res.status(401).json({ message: "not a super admin" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { userAuth, isAdminAuthorized, isSuperAdminAuthorized}