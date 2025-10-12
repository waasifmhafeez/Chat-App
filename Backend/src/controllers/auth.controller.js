import { generateToken } from "../lib/utils.js";
import User from "../models/user.modal.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  // console.log('signUp page')
  // res.send('signUp')

  const { fullName, email, password } = req.body;
  try {
    if (!email || !password || !fullName)
      return res.status(400).json({ message: "All feilds are required." });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 characters." });
    }

    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({ message: "Email already exists. " });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profiePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data provided." });
    }
  } catch (error) {
    console.log("Error is siginUp controller", error.message);
    res.status(500).json({ Message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  // console.log('login page')
  // res.send('login')
  console.log("------------", req.body);

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials." });

    generateToken(user._id, res);

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profiePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller.", error.message);
    res.status(500).json({ message: "Internal server error. " });
  }
};


export const logout = async (req, res) => {
  // console.log('logout page')
  // res.send('logout')

  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Successfully ougged out." });
  } catch (error) {
    console.log("Error in logout controller.", error.message);
    res.send(500).json({ message: "Internal server error." });
  }
};
