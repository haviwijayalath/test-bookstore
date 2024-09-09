import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch the books from the server
        fetch("http://localhost:5000/all-books")
            .then((res) => res.json())
            .then((data) => {
                // Assuming data is the array of books
                if (Array.isArray(data)) {
                    setBooks(data);
                } else {
                    console.error('Unexpected data format:', data);
                    setBooks([]); // Handle unexpected format
                }
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, []);

    const handleDelete = (bookId) => {
        fetch(`http://localhost:5000/book/${bookId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                // Update the book list after deletion
                setBooks(books.filter((book) => book._id !== bookId));
                alert("Book deleted successfully!");
            })
            .catch((error) => {
                console.error("Error deleting book:", error);
                alert("Failed to delete book. Please try again.");
            });
    };

    return (
        <div className="px-4 my-12">
            <h2 className="mb-8 text-3xl font-bold">Manage Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.length > 0 ? (
                    books.map((book) => (
                        <Card key={book._id} className="shadow-md p-4">
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                            >
                                {book.bookTitle}
                            </h3>
                            <p className="text-sm mb-2" style={{ color: '#333', fontWeight: 'bold' }}>
                                <strong>Author:</strong> {book.authorName}
                            </p>
                            <p className="text-sm mb-2" style={{ color: '#333', fontWeight: 'bold' }}>
                                <strong>Category:</strong> {book.category}
                            </p>
                            <p className="text-sm mb-4" style={{ color: '#333', fontWeight: 'bold' }}>
                                <strong>Description:</strong> {book.bookDescription}
                            </p>
                            <div className="flex gap-2">
                                <Link
                                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 flex items-center"
                                    to={`/dashboard/edit-books/${book._id}`}
                                    style={{ color: '#007BFF', fontWeight: 'bold' }} // Inline styles for link
                                >
                                    <FaEdit className="mr-1" />
                                    Edit
                                </Link>
                                <Button
                                    color="danger"
                                    onClick={() => handleDelete(book._id)}
                                    className="bg-red-600 px-4 py-1 font-semibold text-white rounded-sm flex items-center"
                                    style={{ backgroundColor: '#FF4136', fontWeight: 'bold' }} // Inline styles for button
                                >
                                    <FaTrash className="mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-center col-span-full" style={{ color: '#333', fontWeight: 'bold' }}>
                        No books available
                    </p>
                )}
            </div>
        </div>
    );
};

export default ManageBooks;
