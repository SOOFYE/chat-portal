const mongoose = require("mongoose");



const roomSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,  
        },

        admin:{
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: true,
        },

        members:[{type: mongoose.Schema.ObjectId, ref:'Users'}],

        Messages:[{
            message:String,
            sender:{
                type: mongoose.Schema.ObjectId, 
                ref:'Users',
            },
            isFile:Boolean
        }]
        
    }
)


const RoomModel = mongoose.model("Rooms",roomSchema);
module.exports = RoomModel;