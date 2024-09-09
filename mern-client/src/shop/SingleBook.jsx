import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

const SingleBook = () => {
  const { id } = useParams();  // Retrieve the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    // Fetch the book details using the ID from the URL
    fetch(`http://localhost:5000/book/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch book');
        }
        return res.json();
      })
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching book:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    // Implement add to cart functionality here
    console.log('Add to cart:', book);
  };

  if (loading) {
    return <p className='text-center text-lg'>Loading...</p>;
  }

  if (error) {
    return <p className='text-center text-lg text-red-500'>{error}</p>;
  }

  return (
    <div className='px-4 lg:px-24 py-16'>
      {book ? (
        <div className='flex flex-col md:flex-row items-center gap-12'>
          {/* Book image */}
          <div className='w-full md:w-1/3'>
            <img src={book.imageURL} alt={book.bookTitle} className='w-full rounded-lg shadow-lg' />
          </div>

          {/* Book details */}
          <div className='md:w-2/3 space-y-6'>
            <h2 className='text-5xl font-bold text-black'>{book.bookTitle}</h2>
            <p className='text-lg text-gray-700'>By {book.authorName}</p>
            <p className='text-base text-gray-600'>{book.bookDescription}</p>

            <div className='flex items-center space-x-4'>
              <span className='text-2xl font-semibold text-black'>${book.price}</span>
              <button
                onClick={handleAddToCart}
                className='bg-blue-700 px-6 py-2 text-white font-medium flex items-center hover:bg-black transition-all ease-in duration-200'
              >
                <FaCartShopping className='mr-2' /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className='text-center text-lg'>Book not found!</p>
      )}
    </div>
  );
}

export default SingleBook;
