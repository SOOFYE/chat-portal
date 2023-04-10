const jwt = require("jsonwebtoken");



const authRoute = (req,res,next)=>{
    const token = req.cookies['jwt']

    if (token){
        try{

            const decoded = jwt.verify(token,process.env.SECRET_KEY)
            console.log('DECODED',decoded)
            req.USER_ID_DEC = decoded.USER_ID
            next()
        }
        catch(err){
            console.log(err)
            res.status(500).json(err)
        }
       

    }
}
module.exports = authRoute;