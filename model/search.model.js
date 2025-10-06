import pool from "../config.js/db.js";

export const findAllItem = async () => {
  const result = await pool.query(`select * from search`);
  return result;
};

export const findItemById = async (id) => {
  const result = await pool.query(`select * from search where search_id = $1`, [
    id,
  ]);
  return result.rows[0];
};

export const findFavouriteItem = async (is_favourite) => {
  const result = await pool.query(
    `select * from search where is_favourite= TRUE`
  );
};

export const toggleFavourite = async (search_id, currentValue) => {
  try {
    const newValue = !currentValue;

    const result = await pool.query(
      `update search SET is_favourite=$1, search_id=$2`,
      [newValue]
    );

    if (result.rows.length === 0) {
      throw new Error("The item could not be found!");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error", error);
  }

  //   const {is_favourite} = req.body;
};
