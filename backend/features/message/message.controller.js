import Message from "./message.schema.js";



export default class messageController{
    async getMessages(req,res){
       try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate('sender','username')
        .sort({createdAt:-1});
        console.log(messages);
        res.json(messages);
       }
       catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
       }
    }
    async sendMessage(req,res){
        try{
            const {content,chatId}=req.body;

            const message=new Message({
                sender:req.user._id,
                content,
                chat:chatId
            });
            const savedMessage= await message.save();
            const populatedMessage=await Message.findById(savecMessage._id).populate('sender','username');
            res.json(populatedMessage);
        }
        catch(error){
            res.status(500).json({ message: error.message });

        }
    }
}