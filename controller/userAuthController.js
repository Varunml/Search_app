import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import "dotenv/config";
import { authenticateUser, UserRegister } from "../model/user.model.js";
import { title } from "process";

export const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      res.status(401).json({ message: "Please enter the password and email" });
    }

    const user = await authenticateUser(email);

    if (!user) {
      return res
        .status(401)
        .json({ message: `The user ${email} does not exist` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // return res.redirect("/users/home");
    } else {
      return res
        .status(401)
        .json({ message: `The user ${email} has entered the wrong password` });
    }

    const token = jwt.sign(
      { userID: user.user_id },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const refresh_token = jwt.sign(
      { userID: user.user_id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("Access_Token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    return res.status(201).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error(error);
  }
};

export const getUserHome = async (req, res) => {
  // res.send("This is the home pages");
  res.render("pages/home");
};

export const RegisterUser = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { email, password, name } = req.body;

    if (!password || !name) {
      throw new Error("Please enter the Password and Email");
    }

    // console.log(email, password, name);
    const userExists = await authenticateUser(email);

    if (userExists) {
      return res
        .status(409)
        .json({ message: `The user ${email} already exists` });
    }

    const newuser = await UserRegister(email, password, name);
    // console.log(newuser);
    return res
      .status(201)
      .json({ message: `The user ${newuser} has been created successfully!` });
  } catch (error) {
    console.log(error.code, error);
    next(error);
  }
};

export const showLogin = async (req, res) => {
  res.render("pages/login", { title: "Login" });
};

export const showSignup = async (req, res) => {
  res.render("pages/signup", { title: "Signup" });
};

// export const signupUser = async (req, res) => {
//   try {
//     const { password, email, name } = req.body;

//     if (!password || !email) {
//       throw new Error("Please enter the Password and Email");
//     }

//     const user = await authenticateUser(email);

//     if (user) {
//       return res
//         .status(401)
//         .json({ message: "The user already is registered" });
//     }

//     const newUser = await RegisterUser(email, password, name);
//   } catch (error) {
//     console.error(error);
//   }
// };
