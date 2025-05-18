import { User } from '../models/user.model.js';

export const isAdmin = async (req, res, next) => {
    try {
        // Get user from database
        const user = await User.findById(req.id);
        
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        // Check if user is admin
        if (user.role !== 'Admin') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                success: false
            });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({
            message: "Error checking admin privileges",
            success: false
        });
    }
}; 