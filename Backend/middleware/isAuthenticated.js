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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded){
            return res
            .status(401)
            .json({message:"Invalid Token", success: false});
        }

        req.id = decoded.userId;
        next();

    }catch(error){
        res.status(401).json({message: "Invalid Token Server Error"});
    }
}

export default authenticateToken;