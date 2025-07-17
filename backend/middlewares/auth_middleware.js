// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "ABCD");
//     const user = await User.findById(decoded.id);
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
// export default auth



// import { JsonWebTokenError } from "jsonwebtoken";

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

//         const decoded = jwt.verify(token, "ABCD");
//         const user = await User.findById(decoded.id);
        
//         // Fixed: Add null check for user
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }
        
//         req.user = user;
//         next();
//     } catch (error) {
//       console.log(error);
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// // Fixed: Proper export syntax
// // export { auth };
// export default auth;






import pkg from 'jsonwebtoken';
const { JsonWebTokenError } = pkg;
const jwt = pkg;
import User from '../features/users/users.schema.js';

const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        
        // Handle both "Bearer token" and "token" formats
        if (token && token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, "ABCD");
        const user = await User.findById(decoded.id);
        
        // Fixed: Add null check for user
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default auth;