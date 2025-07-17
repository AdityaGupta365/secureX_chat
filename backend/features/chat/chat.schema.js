import mongoose from "mongoose";

import User from "../users/users.schema.js";
const chatSchema= new mongoose.Schema({
    name:{type:String,required:true},
    isGroupChat:{type:Boolean,default:false},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }

})
const Chat = mongoose.model('Chat', chatSchema);
export default Chat;