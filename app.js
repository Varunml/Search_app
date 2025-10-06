import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
// console.log("userRoutes:", userRoutes);

//set view
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/users", userRoutes);
app.use("/search", searchRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("It is running on port", process.env.PORT);
});
