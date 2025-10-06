import express from "express";
const router = express.Router();
import {
  searchAll,
  // searchHistory,
  searchItem,
  favouriteItemUpdate,
} from "../controller/searchController.js";
router.get("/search", searchAll);

router.post("/item/:id", searchItem);
router.post("/updateFavourite", favouriteItemUpdate);
// router.post("/history", searchHistory);

export default router;
