import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import pg from "pg";
import methodOverride from "method-override";

// Load environment variables before anything else
// so process.env values are available to the db config below
dotenv.config({ path: "./.env" });

const app = express();
const port = 3000;

app.use(express.static("public"));

// Parse form data from POST requests (req.body)
app.use(express.urlencoded({ extended: true }));

// Allow HTML forms to send PUT and DELETE requests
// by reading the _method query parameter e.g. ?_method=DELETE
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

// Connect to PostgreSQL using credentials from .env
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();


// ========================
// HOME
// ========================

// Fetch all books and sort them based on the ?sort= query parameter
// Defaults to most recently read if no sort is provided
app.get("/", async (req, res) => {
    const sort = req.query.sort || "recency";

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


// ========================
// ADD BOOK
// ========================

// Render the add book form
app.get("/add", (req, res) => {
    res.render("add");
});

// Insert a new book into the database
// ISBN is stored as text to preserve leading zeros and support both ISBN-10 and ISBN-13
app.post("/add", async (req, res) => {
    const { title, author, date_read, rating, notes, isbn } = req.body;
    try {
        await db.query(
            "INSERT INTO books (title, author, date_read, rating, notes, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
            [title, author, date_read, rating, notes, isbn]
        );
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while adding book");
    }
});


// ========================
// EDIT BOOK
// ========================

// Fetch the book by id and pre-fill the edit form with its current data
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).send("Book not found");
        } else {
            res.render("edit", { book: result.rows[0] });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while fetching book");
    }
});

// Update all fields of a book by id
app.put("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { title, author, date_read, rating, notes, isbn } = req.body;
    try {
        await db.query(
            "UPDATE books SET title = $1, author = $2, date_read = $3, rating = $4, notes = $5, isbn = $6 WHERE id = $7",
            [title, author, date_read, rating, notes, isbn, id]
        );
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while updating book");
    }
});


// ========================
// DELETE BOOK
// ========================

// Permanently remove a book from the database by id
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while deleting book");
    }
});


// ========================
// BOOK DETAIL
// ========================

// Fetch a single book and render its full detail page
app.get("/book/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).send("Book not found");
        } else {
            res.render("book", { book: result.rows[0] });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error while fetching book");
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});