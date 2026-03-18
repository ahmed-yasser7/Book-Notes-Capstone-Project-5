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

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const date_read = req.body.date_read;
    const rating = req.body.rating;
    const notes = req.body.notes;
    const isbn = req.body.isbn;
    try {
        await db.query(
            "INSERT INTO books (title, author, date_read, rating, notes, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
             [
                title, 
                author, 
                date_read, 
                rating, 
                notes,
                isbn
            ]);
            res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while adding book");
    }
});

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        if(result.rows.length === 0) {
            res.status(400).send("Book not found");
        } else {
            res.render("edit", { book: result.rows[0] });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Database error while fetching book");
    }
});

app.put("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const author = req.body.author;
    const date_read = req.body.date_read;
    const rating = req.body.rating;
    const notes = req.body.notes;
    const isbn = req.body.isbn;

    try {
        await db.query("UPDATE books SET title = $1, author = $2, date_read = $3, rating = $4, notes = $5, isbn = $6 WHERE id = $7",
            [
                title,
                author,
                date_read,
                rating,
                notes,
                isbn,
                id
            ]
        );
        res.redirect("/");
    } catch(err) {
        console.error("Database error while updating book", err);
        res.status(500).send("Database error while updating book");
    }
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch(err) {
        console.error("Database error while deleting book", err);
        res.status(500).send("Database error while deleting book");
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});