const mongoose = require("mongoose")



const userSchema = new mongoose.Schema(

    {
        username: {
            type: String,
            required: [true,"Username is required"],
            lowercase: true,
            unique: true,
        },

        email: {
            type: String,
            required: [true,"Email is required"],
            lowercase: true,
            unique: true,
        },

        password: {
            type: String,
            required: [true,"password is required"],
            minlength: [6,"Min Characters need to be 6!"],
            required: [true,"Password is required"],

        },

        joinedGroups:[{type: mongoose.Schema.ObjectId, ref: 'Rooms'}] 

    }
)

const userModel = mongoose.model("Users",userSchema)

module.exports = userModel