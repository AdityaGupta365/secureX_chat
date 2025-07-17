import express from 'express'
import chatController from './chat.controller.js'
import auth from '../../middlewares/auth_middleware.js';

const chatRouter= express.Router()
const CC= new chatController;
chatRouter.use(auth);

chatRouter.post('/oneonechat',(req,res)=>{
    CC.getOnetoOnechat(req,res);
})
chatRouter.post('/groupchat',(req,res)=>{
    CC.createGroupChat(req,res);
})
chatRouter.get('/getchats',(req,res)=>{
    CC.getUserChats(req,res);
})

export default chatRouter;