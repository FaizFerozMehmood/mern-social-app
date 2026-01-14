
import express from "express"


export const createUser = async(req,res)=>{
    try {
          const {userName, email, password} = req.body
      console.log(userName,email,password)
      } catch (error) {
        console.log("error in your route",error.message)
      }
}