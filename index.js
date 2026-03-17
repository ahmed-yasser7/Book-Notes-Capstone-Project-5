import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import pg from "pg";

dotenv.config( {path: "./.env"} );
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});
db.connect();


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});