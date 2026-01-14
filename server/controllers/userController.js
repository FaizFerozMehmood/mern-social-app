
import express from "express"
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import Jwt from "jsonwebtoken"

export const createUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" })
    }
    const hashedPasword = await bcrypt.hash(password, 10)
    if (!hashedPasword) {
      return res.status(400).json({ message: "password not hashed..! " })
    }
    const user = await new User({
      userName: userName,
      email: email,
      password: hashedPasword
    })
    await user.save()
    return res.status(201).json({ message: "User created..!", data: user })
    // console.log(userName, email, password)
  } catch (error) {
    console.log("error in your route", error.message)
    return res.status(500).json({ message: "error creating user..!", error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: "user not found..!" })
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) {
      return res.status(400).json({ message: "password does not match..!" })
    }
    const token = await Jwt.sign({
      userId: user._id,
      email: user.email
    }, "token", { expiresIn: "24h" })
    if (!token) {
      return res.status(400).json({ message: "error generating user token..!" })
    }
    return res.status(201).json({ message: "user loggedIn..!", email: user.email, token })
  } catch (error) {
    return res.status(500).json({ message: "error while logging..", error: error.message });

  }
}