const uuid = require("../utility/uuid");

let books = [];

class BooksController {
    static index(req, res) {
        const { name, reading, finished } = req.query;

        let filteredBooks = books;
        if (name) filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
        if (reading) filteredBooks = filteredBooks.filter(book => book.reading === (reading === "1"));
        if (finished) filteredBooks = filteredBooks.filter(book => book.finished === (finished === "1"));

        res.writeHead(200);
        res.end(JSON.stringify({
            status: "success",
            data: {
                books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
            },
        }));
    }

    static show(id, res) {
        const book = books.find(b => b.id === id);
        if (!book) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                status: "fail",
                message: "Buku tidak ditemukan",
            }));
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            status: "success",
            data: { book },
        }));
    }

    static store(req, res) {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

            if (!name) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    status: "fail",
                    message: "Gagal menambahkan buku. Mohon isi nama buku",
                }));
            }

            if (readPage > pageCount) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    status: "fail",
                    message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
                }));
            }

            const id = uuid();
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            const finished = pageCount === readPage;

            const newBook = {
                id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
            };

            books.push(newBook);

            res.writeHead(201);
            res.end(JSON.stringify({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: { bookId: id },
            }));
        });
    }

    static update(id, req, res) {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

            if (!name) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    status: "fail",
                    message: "Gagal memperbarui buku. Mohon isi nama buku",
                }));
            }

            if (readPage > pageCount) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    status: "fail",
                    message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
                }));
            }

            const bookIndex = books.findIndex(b => b.id === id);
            if (bookIndex === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({
                    status: "fail",
                    message: "Gagal memperbarui buku. Id tidak ditemukan",
                }));
            }

            const updatedAt = new Date().toISOString();
            const finished = pageCount === readPage;
            books[bookIndex] = {
                ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
            };

            res.writeHead(200);
            res.end(JSON.stringify({
                status: "success",
                message: "Buku berhasil diperbarui",
            }));
        });
    }

    static destroy(id, res) {
        const bookIndex = books.findIndex(b => b.id === id);
        if (bookIndex === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                status: "fail",
                message: "Buku gagal dihapus. Id tidak ditemukan",
            }));
        }

        books.splice(bookIndex, 1);
        res.writeHead(200);
        res.end(JSON.stringify({
            status: "success",
            message: "Buku berhasil dihapus",
        }));
    }
}

module.exports = BooksController;
