const mongoose = require('mongoose')
const userschema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps:true
    },
)
const User = mongoose.model('user',userschema)
module.exports = User;