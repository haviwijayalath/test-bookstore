import React, { useEffect, useState , useContext} from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import { CartContext } from '../context/CartContext';

const SingleBook = () => {
  const { id } = useParams();  // Retrieve the book ID from the URL
  const [book, setBook] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the book details using the ID from the URL
    fetch(`http://localhost:5000/book/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);  // Add the book to the cart
    navigate('/cart');  // Redirect to the cart page after adding the book
  };

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
                className='bg-blue-700 px-6 py-2 text-white font-medium flex items-center hover:bg-black transition-all ease-in duration-200'
                onClick={handleAddToCart}
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







//import React from 'react'
//import { useLoaderData } from 'react-router-dom'

{/*const SingleBook = () => {
    const {_id, bookTitle,imageURL} = useLoaderData();
  return (
    <div className='mt-28 px-4 lg:px-24'>
        <img src={imageURL} alt="" className='h-96' />
        <h2>{bookTitle}</h2>
    </div>
  )
}

export default SingleBook*/}
