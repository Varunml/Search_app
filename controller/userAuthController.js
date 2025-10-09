import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import "dotenv/config";
import { hashTokens } from "../Utils/hashToken.js";
import {
  authenticateUser,
  UserRegister,
  allUserHome,
  findUserId,
  userLogout,
  insertRefreshToken,
} from "../model/user.model.js";
import { title } from "process";
import { error } from "console";

export const loginUser = async (req, res) => {
  try {
    console.log("this");
    const { password, email } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Please enter the password and email" });
    }

    const user = await authenticateUser(email);

    if (!user) {
      return res
        .status(401)
        .json({ message: `The user ${email} does not exist` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
    const decoded = jwt.decode(refresh_token);
    if (!decoded) {
      throw new Error("Could not be decoded");
    }
    const user_id = user.user_id;
    const expiresIn = decoded.exp;
    const expiryDate = new Date(expiresIn * 1000);
    console.log(refresh_token);
    const hashRefresh = await hashTokens(refresh_token);
    const refreshInsert = await insertRefreshToken(
      user_id,
      hashRefresh,
      expiryDate
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
    return res.status(500).json("something issue");
  }
};

export const getUserHome = async (req, res) => {
  try {
    const allUser = await allUserHome();
    return res.render("pages/home", {
      title: "Home",
      currentUser: req.user,
      users: allUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const RegisterUser = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { email, password, name } = req.body;
    // Added business logic
    if (!password) {
      throw new Error("Please enter the Password", 401);
    }

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

export const showHome = async (req, res) => {
  res.render("pages/home", { title: "Home" });
};

export const showSignup = async (req, res) => {
  res.render("pages/signup", { title: "Signup" });
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res
        .status(500)
        .json({ message: `Please enter a number in the place of ID` });
    }
    const user = await findUserId(id);

    if (!user) {
      return res
        .status(401)
        .json({ message: `The user does not exist with id ${id} ` });
    }
    // console.log(user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(501).json({ message: "something went wrong " });
  }
};

export const logoutUser = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    res.status(401).json({ message: "Unauthorised entry" });
  }

  

  const result = await userLogout(refresh_token);
};

export const refreshTokenVerify = async (req, res) => {
  try {
    const userID = req.userID;
    const old_token = req.cookies.refresh_token;
    const hashedOldToken = await hashTokens(old_token);
    const deleteOldToken = await userLogout(hashedOldToken);

    if (!userID) {
      return res.status(401).json({ message: "Issue with user" });
    }

    const Access_Token = jwt.sign(
      { userID: userID },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const refresh_token = jwt.sign(
      { userID: userID },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const hashedToken = await hashTokens(refresh_token);
    const hashRefresh = await hashTokens(refresh_token);
    const expiryDate = new Date(expiresIn * 1000);
    const refreshInsert = await insertRefreshToken(
      userID,
      hashRefresh,
      expiryDate
    );
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // const insertToken = await insertRefreshToken(hashedToken);
    return res.status(200).json(Access_Token);
  } catch (error) {
    return res.status(401).json({ message: "Issue with the token generation" });
  }
};
