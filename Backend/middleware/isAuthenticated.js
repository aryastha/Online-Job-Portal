// import {jwt} from 'jsonwebtoken';

import pkg from 'jsonwebtoken';
const jwt = pkg;

const authenticateToken = (req, res, next) =>{
    try{
        const token = req.cookies.token;
        if (!token){
            return res
            .status(401).
            json({message: " Token is not provided", success: false});
        }
        console.log(token);

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if (!decoded){
        //     return res
        //     .status(401)
        //     .json({message:"Invalid Token", success: false});
        // }

        if (!decoded?.userId) {
            return res.status(401).json({
                message: "Invalid Token", 
                success: false
            });
        }

        req.id = decoded.userId;

        req.user = {             // Add new standard property
            _id: decoded.userId,
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
}

export default authenticateToken;