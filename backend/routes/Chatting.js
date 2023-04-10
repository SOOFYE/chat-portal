const express = require('express')
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const Users = require("../schemas/user.model")
const Rooms = require("../schemas/room.model");

const authRoute = require('../authentication/auth.js')

router.route('/CreateRoom').post(authRoute,async(req,res)=>{

    const { roomName } = req.body

    try{
        const newRoom = new Rooms({
            name: roomName,
            admin: req.USER_ID_DEC
        })

        CREATED_ROOM = await newRoom.save()
        console.log("ROOM CREATED")

        USER_JOINED = await Users.findOneAndUpdate(
            { _id: req.USER_ID_DEC },
            { $addToSet: { joinedGroups: CREATED_ROOM._id } }
        )


        res.status(201).json('ROOM CREATED and JOINED')


    }catch (err){
        console.log(err)
        res.status(401).json("CREATING ROOM ERROR")
    }

})

router.route('/UpdateUserRoom').post(authRoute,async(req,res)=>{

    const { roomID } = req.body;

  try {

    const doesRoomExist = await Rooms.exists({ _id: roomID });

    if (doesRoomExist) {

    const isUserMember = await Rooms.exists({ _id: roomID, $or: [{ members: req.USER_ID_DEC }, { admin: req.USER_ID_DEC }] });

    if (isUserMember) {
        res.status(401).json("User is already a member of the room!");
        return;
      }
      
    Users.findOneAndUpdate(
        { _id: req.USER_ID_DEC },
        { $addToSet: { joinedGroups: roomID } }
      )
        .then(() => {
          console.log("Updated USER!");
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json("UserUpdateError");
        });
      Rooms.findOneAndUpdate(
        { _id: roomID },
        { $addToSet: { members: req.USER_ID_DEC } }
      )
        .then(() => {
          console.log("Rooms Updated");
          res.status(201).json("Room is Added!");
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json("Room update ERROR");
        });
    } else {
      res.status(401).json("Room doesnt Exist!");
    }
  } catch (err) {
    console.log(err)
    res.status(401).json(err);
  }
});



router.route('/GetJoinedRooms').get(authRoute,async(req,res)=>{

    try{
        
        const user = await Users.findOne({_id: req.USER_ID_DEC}).populate('joinedGroups');
        
        if(user){
            const joinedGroups = user.joinedGroups
            res.status(201).json({JOINED_G: joinedGroups})
          }
          else{
            res.status(401).json("User is not Available")
          }
      
        }catch(err){
          res.status(401).json(err.response);
        }
})




module.exports = router;