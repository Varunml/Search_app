import express from "express";
const router = express.Router();

import {
  getUserHome,
  loginUser,
  RegisterUser,
  showLogin,
  showSignup,
  showHome,
  getUserById,
  logoutUser,
  refreshTokenVerify,
} from "../controller/userAuthController.js";

import { refreshToken } from "../middleware/refreshTokenAuth.js";

import authenticateJwt from "../middleware/authenticateJwt.js";
// console.log("User routes loaded");
// router.get("/home",authenticateJwt, showHome);
router.get("/home", authenticateJwt, getUserHome);
router.get("/home/:id", getUserById);
router.get("/login", showLogin);
router.get("/signup", showSignup);
router.post("/signup", RegisterUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken, refreshTokenVerify);

// router.post("/signup", RegisterUser);
// router.post("/");

export default router;
