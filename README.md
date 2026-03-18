# My Bookshelf

A personal book tracking web app where you can log books you have read, rate them, write notes, and view their covers fetched automatically from the Open Library API.

## Features

- Log books with title, author, ISBN, rating, date read, and personal notes
- View book covers fetched from the Open Library Covers API using ISBN
- Sort your library by most recent, top rated, or alphabetically
- Search books by title or author in real time
- Edit or delete any book entry
- Dark mode toggle that persists across sessions
- Click any book to view its full detail page

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, pg
- **Templating**: EJS
- **API Integration**: Axios
- **External API**: Open Library Covers API
- **Frontend**: Custom CSS, Vanilla JS
- **Environment Variables**: dotenv
- **Method Override**: method-override (for PUT and DELETE from HTML forms)

## Database Setup

Run the following in pgAdmin:

```sql
CREATE DATABASE books_read;
```

Then inside that database:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  rating DECIMAL(3,1),
  notes TEXT,
  date_read DATE,
  isbn VARCHAR(13)
);
```

## Setup Instructions

1. Clone the repository

```
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file in the root directory

```
DB__HOST=localhost
DB_NAME=books_read
DB_PASSWORD=your_postgres_password
DB_PORT=5432
DB_USER=your_postgres_username
```

4. Set up the database using the SQL commands above in pgAdmin

5. Run the application

```
node index.js
```

6. Open your browser and visit

```
http://localhost:3000
```

## Project Structure

```
my-bookshelf/
├── index.js                  # Main server file
├── views/
│   ├── index.ejs             # Home page - book library
│   ├── add.ejs               # Add book page
│   ├── edit.ejs              # Edit book page
│   └── partials/
│       ├── header.ejs        # Header partial
│       └── footer.ejs        # Footer partial
├── public/
│   └── styles/
│       └── main.css          # Custom styles
├── .env                      # Environment variables (not tracked)
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Future Improvements

- Reading goal tracker
- Book categories and tags
- Reading statistics and charts
- Search by ISBN
- Export library to CSV

## Author

Ahmed Yasser - Capstone Project 5 - Web Development Course 2025

## License

This project is for educational purposes.