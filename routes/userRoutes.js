import express from "express";
const router = express.Router();

import {
  getUserHome,
  loginUser,
  RegisterUser,
  showLogin,
  showSignup,
  
} from "../controller/userAuthController.js";
// console.log("User routes loaded");
router.get("/home", getUserHome);
router.get("/login", showLogin);
router.get("/signup", showSignup);
router.post("/signup", RegisterUser);
router.post("/login", loginUser);
// router.post("/signup", RegisterUser);
// router.post("/");

export default router;
