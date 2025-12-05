import User from "../models/user.modal.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in getUsersForSidebar messageController.", err);
    res.status(500).json({ error: "Internal Server error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage messageController.", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    console.log("Image URL after upload:", imageUrl);

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    console.log("New message to be saved:", newMessage);
    await newMessage.save();

    const receiverSocketid = getRceiverSocketId(receiverId);

    if (receiverSocketid) {
      io.to(receiverSocketid).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
    //todo sockets stuff...
  } catch (error) {
    console.log("Error is sendMessage messageController.", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
