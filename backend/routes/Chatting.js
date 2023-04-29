const express = require('express')
var router = express.Router();
const bcrypt = require('bcrypt')


const Users = require("../schemas/user.model")
const Rooms = require("../schemas/room.model");

const authRoute = require('../authentication/auth.js')


router.route('/VerifyLoggedin').get(authRoute,async(req,res)=>{
  
    const user = await Users.findOne({ _id: req.USER_ID_DEC });
    if(!user){
        res.status(401).json('NOT LOGGED IN')
    }
    const RETURN_OBJ = {
        username: user.username,
        user_id: user._id
    }

    res.status(201).json(RETURN_OBJ)
})

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

router.route('/AddUserInGroup').post(authRoute,async(req,res)=>{

  const {adduser,CURRENT_ROOM_JOINED} = req.body

  console.log(req.body)

  try{
    const user = await Users.exists({ username: adduser });

    if(user){
      const user_details = await Users.findOne({username: adduser})

      if (user_details.joinedGroups.includes(CURRENT_ROOM_JOINED)){
        res.status(400).json('User is already in this group')
      }

      Rooms.findOneAndUpdate(
        { _id: CURRENT_ROOM_JOINED },
        { $addToSet: { members: user_details._id } }
      ).then(()=>{
        //res.status(201).json('User Added in the Group')

       Users.findOneAndUpdate(
        {username:adduser },
        {$addToSet: {joinedGroups:CURRENT_ROOM_JOINED }}
       ).then(()=>{
        res.status(201).json('User Added in the Group')
       }).catch((error)=>{
        console.log(error)
       })

      }).catch((error)=>{
        console.log(error)
      })
    }
    else{
      res.status(400).json('NO USER FOUND')
    }

  }catch(error){

    console.log(error)

  }
})

router.route('/GetALLGROUPDETAILS').post(authRoute,async(req,res)=>{

  const { CURRENT_ROOM_JOINED } = req.body

  try{

  const all_users = await Rooms.findOne({_id: CURRENT_ROOM_JOINED}).populate('members').populate('admin');


  res.status(201).json({USER_DETAILS:all_users})

  }catch(error){
    res.status(500).json(error)
  }


})



router.route('/SaveGroupMessages').post(authRoute,(req,res)=>{

  const {USER_ID,MESSAGE,ROOM_ID,isFile} = req.body

  console.log(req.body)

  
    Rooms.findOneAndUpdate(
      {_id:ROOM_ID},
      {$push: 
        {Messages:
          {"message":MESSAGE,
          "sender":USER_ID,
          "isFile":isFile}}}
      
      ).then(
        res.status(201).json('Message Saved')
      ).catch(err=>{
        console.log(err)
        res.status(500).json('Error Saving Messages!!!!')
      })
  
  


})



router.route('/GetGroupMessages/:ROOM_ID').get(async (req,res)=>{

  console.log('GET MESSAGES1!!!!!')
  const {ROOM_ID} = req.params


  console.log(req.params)

  try{
    const Room = await Rooms.findOne({_id: ROOM_ID}).populate('Messages.sender');
    console.log(Room.Messages);
    res.status(200).json(Room.Messages);
  }
  catch(err){
    res.status(401).json("Error Getting Message!")
    console.log(err.response);
  }

    

})


router.route('/KickUser').post(authRoute,async (req,res)=>{

  const {USER_ID,GROUP_ID} = req.body
  
  try{
  const deleted = await Users.findOneAndUpdate(
    {_id: USER_ID},
    {$pull: {joinedGroups: GROUP_ID}
    })

  const updatedJoinedMembers =  await Rooms.findOneAndUpdate(
    {_id: GROUP_ID},
    {$pull: {members: USER_ID }}
  )


  
    res.status(201).json('DELETED')

  }catch(error){
    res.status(401).json('ERROR while kicking user.!')
  }
 



})

router.route('/GetGroupMessages/:ROOM_ID').get(async (req,res)=>{

  console.log('GET MESSAGES1!!!!!')
  const {ROOM_ID} = req.params


  console.log(req.params)

  try{
    const Room = await Rooms.findOne({_id: ROOM_ID}).populate('Messages.sender');
    console.log(Room.Messages);
    res.status(200).json(Room.Messages);
  }
  catch(err){
    res.status(401).json("Error Getting Message!")
    console.log(err.response);
  }

    

})


router.route('/changePassword').post(authRoute,async (req,res)=>{

  const {oldPassword,newPassword} = req.body

  console.log('asdasdas')

  const user = await Users.findOne({_id:req.USER_ID_DEC})
  
  if(!user)
    return res.status(401).json('User not found!!!')

  const isMatch = await bcrypt.compare(oldPassword,user.password);

  if(!isMatch)
    return res.status(401).json("Old Password does not match!");

  const salt = await bcrypt.genSalt(10)
  hashed_password = await bcrypt.hash(newPassword,salt)

  const updated = await Users.findOneAndUpdate(
    {_id: req.USER_ID_DEC },
    {password:hashed_password }
  )

  if(updated)
    return res.status(201).json('Password Updated')
  else
    return res.status(500).json('Internal Server Error while saving password')
  

    
})







module.exports = router;