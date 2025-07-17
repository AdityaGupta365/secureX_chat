import Chat from "./chat.schema.js";


export default class chatController{
    async getOnetoOnechat(req,res){
        try{
            const {userId}=req.body;
            let chat=await Chat.findOne({
                isGroupChat:false,
                users:{$all:[req.user._id,userId]}
            }).populate('users','-password');
            
            if(!chat){
                const users=[req.user._id,userId];
                const newChat=new Chat({
                    name:'Private Chat',
                    users,
                    isGroupChat:false
                });
                chat = await newChat.save();
                chat = await Chat.findById(chat._id).populate('users', '-password');

            }
            res.json(chat);
        }
        catch(error){
            res.status(500).json({message:error.message});
        }
    }
    async  createGroupChat(req,res){
        try{
           const{name,users}=req.body;
           const groupChat =new Chat({
                name,
                users:[req.user._id,...users],
                isGroupChat:true,
                admin:req.user._id
           })
            const chat = await groupChat.save();
            const populatedChat = await Chat.findById(chat._id).populate('users', '-password');
    
            res.json(populatedChat);

        }
        catch(error){
            res.status(500).json({ message: error.message });
        }
    }
    async getUserChats(req,res){
        try{
            const chats=await Chat.find({
                users:{$elemMatch:{$eq:req.user._id}}
            })
            .populate('users','-password')
            .populate({
                path:'admin',
                select:'-password'
            })
            .sort({createdAt:-1});
            res.json(chats);
        }
        catch(error){
            res.status(500).json({message:error.message});
        }
    }
}