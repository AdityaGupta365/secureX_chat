// import User from "./users.schema.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// export default class UserController{
//     async register(req,res){
//         try{
//            const{username,email,password}=req.body;

//            const existingUser=await User.findOne({
//             $or:[{email},{username}]
//            });
//            if(existingUser){
//              return res.status(400).json({message:'User already exists'});
//            }
//                const hashedPassword = await bcrypt.hash(password, 10);
//                 const user = new User({ username, email, password: hashedPassword });
//                 await user.save();
//                 res.status(201).json({
//                     user:{id:user._id,username,email}
//                 });

//         }
//         catch(err){
//             console.log(err);
//             res.status(500).json({message:error.message});
//         }

//     }
//     async login(req,res){
//         try{
//            const{email,password}=req.body;

//            const user=await User.findOne({email});
//            if(!user){
//              return res.status(400).json({message:'Invalid Credentials'});
//            }
//            const isMatch=await bcrypt.compare(password,user.password);
//            if(!isMatch){
//              return res.status(400).json({message:'Invalid Credentials'});
//            }
//            const token =jwt.sign({id:user._id},process.env.JWT_SECRET||"ABCD");
//            res.json({
//             token,
//             user:{id:user._id,username:user.username,email:user.email}
//            });

//         }
//         catch(err){
//             console.log(err);
//             res.status(500).json({message:err.message});
//         }

//     }
//     async getAllUsers(req,res){
//         try{
//             const users =await User.find({_id:{$ne:req.user._id}}).select('-password');
//             res.json((users));
//         }
//         catch(error){
//             res.status(500).json({message:error.message});
//         }
//     }

// };



import User from "./users.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class UserController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            res.status(201).json({
                user: { id: user._id, username, email }
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message }); // Fixed: changed 'error' to 'err'
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }
            const token = jwt.sign({ id: user._id }, "ABCD");
            res.json({
                token,
                user: { id: user._id, username: user.username, email: user.email }
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            // Fixed: Add null check for req.user
            if (!req.user || !req.user._id) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

// Fixed: Proper auth middleware with null checks
// const auth = async (req, res, next) => {
//     try {
//         let token = req.header('Authorization');
        
//         // Handle both "Bearer token" and "token" formats
//         if (token && token.startsWith('Bearer ')) {
//             token = token.replace('Bearer ', '');
//         }
        
//         if (!token) {
//             return res.status(401).json({ message: 'No token provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "ABCD");
//         const user = await User.findById(decoded.id);
        
//         // Fixed: Add null check for user
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }
        
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// // Fixed: Proper export syntax
// export { auth };