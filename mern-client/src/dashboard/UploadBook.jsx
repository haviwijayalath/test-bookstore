import React, { useState } from 'react';
import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react';

const UploadBook = () => {
    const [bookData, setBookData] = useState({
        bookTitle: "",
        authorName: "",
        imageURL: "",
        category: "",
        bookDescription: "",
        bookPdfUrl: "",
    });

    const bookCategories = [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Programming",
        "Science Fiction",
        "Biography",
        "Autobiography",
        "History",
        "Self-help",
        "Business",
        "Children Books",
        "Art and Design",
    ];

    const handleBookSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const bookTitle = form.bookTitle.value;
        const authorName = form.authorName.value;
        const imageURL = form.imageURL.value;
        const category = form.category.value;
        const bookDescription = form.bookDescription.value;
        const bookPdfUrl = form.bookPdfUrl.value;

        const bookObj = {
            bookTitle,
            authorName,
            imageURL,
            category,
            bookDescription,
            bookPdfUrl,
        };

        fetch("http://localhost:5000/upload-book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookObj),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert("Book uploaded successfully!");
                setBookData({
                    bookTitle: "",
                    authorName: "",
                    imageURL: "",
                    category: "",
                    bookDescription: "",
                    bookPdfUrl: "",
                });
            })
            .catch((error) => {
                console.error("Error uploading book:", error);
                alert("Failed to upload book. Please try again.");
            });
    };

    return (
        <div className='my-12'>
            <h2 className='mb-8 text-3xl font-bold text-black'>Upload A New Book</h2>
            <form onSubmit={handleBookSubmit} className='flex flex-col flex-wrap gap-4'>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bookTitle" value="Book Title" />
                    </div>
                    <TextInput
                        id="bookTitle"
                        name="bookTitle"
                        placeholder="Book name"
                        required
                        type="text"
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.bookTitle}
                        onChange={(e) =>
                            setBookData({ ...bookData, bookTitle: e.target.value })
                        }
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="authorName" value="Author Name" />
                    </div>
                    <TextInput
                        id="authorName"
                        name="authorName"
                        placeholder="Author name"
                        required
                        type="text"
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.authorName}
                        onChange={(e) =>
                            setBookData({ ...bookData, authorName: e.target.value })
                        }
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="imageURL" value="Image URL" />
                    </div>
                    <TextInput
                        id="imageURL"
                        name="imageURL"
                        placeholder="Link to the book image"
                        required
                        type="url"
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.imageURL}
                        onChange={(e) =>
                            setBookData({ ...bookData, imageURL: e.target.value })
                        }
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="category" value="Category" />
                    </div>
                    <Select
                        id="category"
                        name="category"
                        required
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.category}
                        onChange={(e) =>
                            setBookData({ ...bookData, category: e.target.value })
                        }
                    >
                        <option value="">Select a category</option>
                        {bookCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bookDescription" value="Book Description" />
                    </div>
                    <Textarea
                        id="bookDescription"
                        name="bookDescription"
                        placeholder="Brief description of the book"
                        required
                        rows={4}
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.bookDescription}
                        onChange={(e) =>
                            setBookData({ ...bookData, bookDescription: e.target.value })
                        }
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
                    </div>
                    <TextInput
                        id="bookPdfUrl"
                        name="bookPdfUrl"
                        placeholder="Link to the book PDF"
                        required
                        type="url"
                        style={{ color: '#333', backgroundColor: '#f9f9f9', fontWeight: 'bold' }} // Inline styles
                        value={bookData.bookPdfUrl}
                        onChange={(e) =>
                            setBookData({ ...bookData, bookPdfUrl: e.target.value })
                        }
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-32 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default UploadBook;
