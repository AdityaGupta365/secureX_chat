

import express from 'express'
import messageController from './message.controller.js'
import auth from '../../middlewares/auth_middleware.js'


const MC = new messageController()

const messageRouter= express.Router()
messageRouter.use(auth)

messageRouter.get('/:chatId',(req,res)=>{
    MC.getMessages(req,res);
})
messageRouter.post('/sendmessages/',(req,res)=>{
    MC.sendMessage(req,res);
})

export default messageRouter