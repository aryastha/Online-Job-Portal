import pkg from 'jsonwebtoken';
import { User } from '../models/user.model.js';
const jwt = pkg;

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Token is not provided", success: false });
                console.log('No token provided');
        }

        

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            });
        }

        // Get user from database to include role
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        req.id = decoded.userId;
        req.user = {
            _id: decoded.userId,
            role: user.role.toLowerCase()
        };
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            message: error.name === 'JsonWebTokenError'
                ? "Invalid Token"
                : "Authentication Failed",
            success: false
        });
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Access denied. Only ${roles.join(' or ')} can perform this action.`,
                success: false
            });
        }
        next();
    };
};

// For backward compatibility
export default protect;