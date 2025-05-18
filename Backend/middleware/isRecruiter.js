import { User } from '../models/user.model.js';

// Middleware to check if the user is a recruiter
export const isRecruiter = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.role.toLowerCase() !== 'recruiter') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Recruiter role required.'
            });
        }

        next();
    } catch (error) {
        console.error('isRecruiter middleware error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}; 