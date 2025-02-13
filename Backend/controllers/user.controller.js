import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const register = async(req,res) =>{
    try{
        const {fullname,email, password, phoneNumber, pancard, role} = req.body;

        if (!fullname || !email || !password || !phoneNumber || !pancard || !role){
            return res.status(404).json({
                message: "Missing required fields",
                sucess: false,
            });
        }

        const user = await User.findOne({email});
        if (user){
            return res.status(404).json({
                message: "User already exists",
                success: false,
            })
        }

       
        //covert password into hashed
        const hashedPassword = await bcrypt.hash(password,10);
        
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            pancard,
            role,
        });

        return res.status(200).json({
            message: `User is registered successfully {fullname}`,
            success: true,
        })

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error register failed",
            success: false,
        })
    }
}; 


export const login = async(req, res) =>{
    try{

        const {email, password, role } = req.body;

        if (!email || !password || !role){
            return res.status(404).json({
                message: "Missing required fields",
                success: false,
            });

        }
        
        let user = await User.findOne({email});
        if (!user){
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(404).json({
                message: "Incorrect password",
                success: false,
            });
        }

        if (user.role !== role){
            return res.status(404).json({
                message: " Your role dont match to login",
                sucess: false,
            });
        }

        //generate token
        const tokenData ={
            userId: user.id,
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET,{
            expiresIn : "1d",
        });


        user={
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        };

        return res.status(200)
        .cookie("token", token,{
            maxAge: 1 * 24*60*60*1000, // 1 day
            httpOnly: true, //prevent from client side access
            sameSite: "Strict",
        }).json({
            message: `Welcome back ${user.fullname}!`,
            user,
            success: true,
        });   
    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error login failed",
            success:false,
        });
    }
}

export const logout = async(res, req) =>{

    try{
        return res.status(200).cookie("token","", {maxAge:0}).json({
            message: "Logged out successfully",
            success: true,
        })

    }catch(error){
        return res.status(500).json({
            message: "Server error logout failed",
            success: false,
        })
    }
}

export const updateprofile = async(res, req) =>{
    try{
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file = req.files;


        if (!fullname || !email || !phoneNumber || !bio || !skills){
            return res.status(404).json({
                message: " Missing required fields",
                success: false,
            });
        }






//Cloudinary upload




        const sillArray = skills.split(',');
        const userId = req.id //from middleware
        let user = await User.findById(userId);

        if (!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }

        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.bio = bio;
        user.skills = sillArray;

        await user.save();

        user={
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        };

        return res.status(200).json({
            message: `Profile updated successfully ${fullname}`,
            user,
            success: true,
        })

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error update profile failed",
            success: false,
        })
    }
}
