
import express from 'express'
import UserController from './users.controller.js';
import auth from '../../middlewares/auth_middleware.js';
const userRouter=express.Router();
const UC= new UserController();


userRouter.post('/register',(req,res)=>{
    UC.register(req,res);
})
userRouter.post('/login',(req,res)=>{
    UC.login(req,res);
})
userRouter.use(auth);
userRouter.get('/users',(req,res)=>{
    UC.getAllUsers(req,res);
})

export default userRouter;