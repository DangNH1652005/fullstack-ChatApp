import { cloudinary } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId }}).select("-password");
        // res.status(200).json({data: filteredUsers});
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUserForSidebar", error.message);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export const getMessages = async (req, res) =>{
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [  //thỏa mãn ít nhất một trong hai điều kiện
                { senderId: myId, receiverId: userToChatId},
                { senderId: userToChatId, receiverId: myId},
            ]    
        });

        //res.status(200).json({data: messages});
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();


        //realtime function
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessages", newMessage);
        }

        //res.status(200).json({ data: newMessage });
        res.status(200).json( newMessage );

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}