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
            username: SAVED_USER.username
        }

        
        res.cookie('jwt',token)

        res.status(201).json(RETURN_OBJECT)

    }catch(err){
        console.log('ERROR',err)

        if(err.code==11000){
            const field = err.message.split('index: ')[1].split(' dup key')[0];
            res.status(409).json({DUP_FIELD: field});
        }
        else if(err.code===18){
            res.status(408).json({ERR_MSG: 'Minimum Length should be 6'});
        }
        else{
            res.status(500).json({ERR_MSG: 'Internal Server Error!'});
        }     
    }

})


router.route('/login').post(async(req,res)=>{
    const {username,password} = req.body
    const user = await Users.findOne({$or:[{username:username},{email:username}]})
    console.log(user)
    if (!user){
        return res.status(402).json({ERR_MSG: 'This user does not exist!'})
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({ ERR_MSG: 'Invalid credentials!' });
    }

    const token = jwt.sign({USER_ID: user._id}, process.env.SECRET_KEY, { expiresIn: 3 * 24 * 60 * 60 });
    console.log("JWT TOKEN", token);

    const RETURN_OBJECT = {
        Userid: user._id,
        username: user.username
    }

   
    res.cookie('jwt',token)

    res.status(200).json(RETURN_OBJECT)


})


router.route('/cookie').get((req,res)=>{
    
    console.log(req.cookies)
})

module.exports = router;