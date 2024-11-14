# Bookshelf API

This is a RESTful API for managing books in a bookshelf. It allows the creation, updating, deletion, and retrieval of books with features like filtering and searching.

## Requirements

- Node.js version >= 22.11.0
- NPM

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the application: `npm run start`
4. API will be available on port 9000

## Routes

- POST `/books` - Add a new book
- GET `/books` - Get all books
- GET `/books/{bookId}` - Get a book by ID
- PUT `/books/{bookId}` - Update a book by ID
- DELETE `/books/{bookId}` - Delete a book by ID
