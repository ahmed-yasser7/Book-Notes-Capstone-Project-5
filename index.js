import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import pg from "pg";
import methodOverride from "method-override";

dotenv.config( {path: "./.env"} );
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});
db.connect();

// GET home page - fetch all books from database
app.get("/", async (req, res) => {
  const sort = req.query.sort || "recency";

  // Determine sort order based on query parameter
  let orderBy;
  if (sort === "rating")  orderBy = "rating DESC";
  if (sort === "title")   orderBy = "title ASC";
  if (sort === "recency") orderBy = "date_read DESC";

  try {
    const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    res.render("index", { 
        books: result.rows, 
        sort: sort,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});