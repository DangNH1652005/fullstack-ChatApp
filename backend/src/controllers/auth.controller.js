import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { cloudinary } from '../lib/cloudinary.js';


export const signup = async (req, res)=>{
    const { fullName, email, password } = req.body;

    
    try {
        if(!fullName || !email || !password){
            return res.status(401).json({
                message: "email, fullname, password must be required"
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                message: "Password must be at least 6 character"
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message: "Email has been exist"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email, 
            password: hashPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            return res.status(400).json({
                message: "Invalid user data"
            });
        }    
    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(400).json({
            message: "Internal server end"
        });
    }
};

export const login = async (req, res)=>{
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User does not create"
            });
        }
        
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(401).json({
                message: "Password is incorrect"
            });
        }

        generateToken(user._id, res);

        res.status(201).json({
            message: "login successfully",
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
        

    } catch (error) {
        console.log("Error internal server, ", error.message);
        return res.status(401).json({
            message: "Error login"
        });
    }
};

export const logout = (req, res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(201).json({
            message: "Logout successfully"
        });

    } catch (error) {
        console.log("Error logout in controller: ", error.message);
        return res.status(401).json({
            message: "Internal server error"
        });
    }
};

export const updateProfile = async (req, res)=>{
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: "Profile Picture must required"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(201).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        return res.status(400).json({
            message: "Internal server error"
        });
    }

} 

export const checkAuth = async (req, res)=>{
    try {
        res.status(201).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(400).json({
            message: "internal server error",
        });
    }
}