import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const hashedPasword = await bcrypt.hash(password, 10);
    if (!hashedPasword) {
      return res.status(400).json({ message: "password not hashed..! " });
    }
    const user = await new User({
      userName: userName,
      email: email,
      password: hashedPasword,
    });
    await user.save();
    return res.status(201).json({ message: "User created..!", data: user });
    // console.log(userName, email, password)
  } catch (error) {
    console.log("error in your route", error.message);
    return res
      .status(500)
      .json({ message: "error creating user..!", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "user not found..!" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "password does not match..!" });
    }
    const token = await Jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      "token",
      { expiresIn: "24h" },
    );
    if (!token) {
      return res
        .status(400)
        .json({ message: "error generating user token..!" });
    }
    return res.status(201).json({
      message: "user loggedIn..!",
      email: user.email,
      id: user._id,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error while logging..", error: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(404).json({ message: "profile image not found" });
    }
    const updated = await User.findByIdAndUpdate(
      id,
      {
        profileImage,
      },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "user not found..!" });
    }
    return res.status(201).json({ message: "profile Updated", data: updated });
  } catch (error) {
    console.log("error in your route", error.message);
    return res
      .status(500)
      .json({ message: "error updating user..!", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json({ message: "Id not found while getting user" });
    }
    const user = await User.findById(id).select(
      "userName profileImage followers following ",
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found against the id provided" });
    }
    return res
      .status(200)
      .json({ message: "user fetched successfully..!", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error getting user..!", error: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const loggedInuserId = req.user.id;
    console.log(loggedInuserId)
    const users = await User.find().select("-password -__v").lean();
    const userfollowStatus = users.map((user) => ({
      ...user,
      isFollowing: user.followers?.some((id)=> id.toString()===loggedInuserId)?? false,
    }));
    if (users.length===0) {
      return res.status(404).json({ message: "users not found " });
    }
    return res
      .status(200)
      .json({ message: "Users fetched..!", data: userfollowStatus });
  } catch (error) {
    console
      .log(error.message)
      return res.status(500).json({ message: "error getting users..!", error: error.message });
  }
};
