const express = require('express')
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const Users = require("../schemas/user.model")


router.route('/signup').post(async (req,res)=>{
    const {username,email,password} = req.body

    console.log(req.body)

    const salt = await bcrypt.genSalt(10)
    hashed_password = await bcrypt.hash(password,salt)


    const NEW_USER = new Users({
        username: username,
        email: email,
        password: hashed_password
    })

    try{

        const SAVED_USER = await NEW_USER.save()
        const USER_ID = SAVED_USER._id
        const token = jwt.sign({USER_ID},process.env.SECRET_KEY,{ expiresIn: 3 * 24 * 60 * 60 })
        console.log("JWT TOKEN",token)

        const RETURN_OBJECT = {
            Userid: SAVED_USER._id,
            jwtToken: token
        }

        res.status(201).json(RETURN_OBJECT)

    }catch(err){
        console.log('ERROR',err)

        if(err.code==11000){
            const field = err.message.split('index: ')[1].split(' dup key')[0];
            res.status(409).json({DUP_FIELD: field});
        }
        else{
            res.status(500).json({ERR_MSG: 'Internal Server Error!'});
        }     
    }

})

module.exports = router;