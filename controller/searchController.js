import express from "express";
import {
  findAllItem,
  findItemById,
  findFavouriteItem,
  toggleFavourite
} from "../model/search.model.js";

export const searchAll = async (req, res) => {
  const { name } = req.body;
  try {
    let allItems = await findAllItem();
    res.status(201).json({ message: "This is the list of all the items" });
  } catch (error) {
    res.status(401).json({ message: "Error listing all the items" });
  }
};
export const searchItem = async (req, res) => {
  try {
    const search_id = req.params.id;

    const itemSearched = await findItemById(search_id);

    if (!itemSearched) {
      return res
        .status(404)
        .json({ message: `The item id ${search_id} is not found` });
    }
    res.status(201).json({ message: itemSearched });
  } catch (error) {
    console.error(error);
  }
};
export const favouriteItemUpdate = async (req, res) => {
  try {
    const { is_favourite } = req.body;

    const currentValue = is_favourite.toLowerCase() === "true";

    const updatedItem = await toggleFavourite(search_id, currentValue);
    res.status(201).json({
      message: `The value of item ${item_name} ${is_favourite} has been updated successfully`,
    });
  } catch (error) {
    console.error("The item could not be updated");
    res.status(500).json({ message: "Server error" });
  }
};
// export const searchHistory = (req, res) => {};
