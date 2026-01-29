


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
            const token = jwt.sign({ id: user._id }, "ABCD",{expiresIn:'2h'});
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

// // Fixed: Proper auth middleware with null checks
// // const auth = async (req, res, next) => {
// //     try {
// //         let token = req.header('Authorization');
        
// //         // Handle both "Bearer token" and "token" formats
// //         if (token && token.startsWith('Bearer ')) {
// //             token = token.replace('Bearer ', '');
// //         }
        
// //         if (!token) {
// //             return res.status(401).json({ message: 'No token provided' });
// //         }

// //         const decoded = jwt.verify(token, process.env.JWT_SECRET || "ABCD");
// //         const user = await User.findById(decoded.id);
        
// //         // Fixed: Add null check for user
// //         if (!user) {
// //             return res.status(401).json({ message: 'User not found' });
// //         }
        
// //         req.user = user;
// //         next();
// //     } catch (error) {
// //         res.status(401).json({ message: 'Invalid token' });
// //     }
// // };

// // // Fixed: Proper export syntax
// // export { auth };







// users.controller.js
// import User from "./users.schema.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "ABCD";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
// const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

// export default class UserController {
//   // Register
//   async register(req, res) {
//     try {
//       const { username, email, password } = req.body ?? {};

//       if (!username || !email || !password) {
//         return res.status(400).json({ message: "username, email and password are required" });
//       }

//       const normalizedEmail = String(email).trim().toLowerCase();

//       const existingUser = await User.findOne({
//         $or: [{ email: normalizedEmail }, { username: username.trim() }]
//       });

//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
//       const user = new User({
//         username: username.trim(),
//         email: normalizedEmail,
//         password: hashedPassword
//       });

//       await user.save();

//       return res.status(201).json({
//         user: { id: user._id, username: user.username, email: user.email }
//       });
//     } catch (err) {
//       console.error("Register error:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }

//   // Login
//   async login(req, res) {
//     try {
//       const { email, password } = req.body ?? {};

//       if (!email || !password) {
//         return res.status(400).json({ message: "email and password are required" });
//       }

//       const normalizedEmail = String(email).trim().toLowerCase();
//       const user = await User.findOne({ email: normalizedEmail });

//       // Use 401 for auth failures and keep message generic to avoid user enumeration
//       if (!user) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//     //   if (!JWT_SECRET) {
//     //     console.error("JWT_SECRET is not configured");
//     //     return res.status(500).json({ message: "Server configuration error" });
//     //   }

//       const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//       return res.json({
//         token,
//         user: { id: user._id, username: user.username, email: user.email }
//       });
//     } catch (err) {
//       console.error("Login error:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }

//   // Get all users except current
//   async getAllUsers(req, res) {
//     try {
//       if (!req.user || !req.user._id) {
//         return res.status(401).json({ message: "User not authenticated" });
//       }

//       const users = await User.find({ _id: { $ne: req.user._id } }).select("-password -__v");
//       return res.json(users);
//     } catch (err) {
//       console.error("GetAllUsers error:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// }
