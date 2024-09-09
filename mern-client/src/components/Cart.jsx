// import { useContext } from 'react';
// import { CartContext } from '../context/CartContext';

// const Cart = () => {
//   const { cart, updateQuantity, clearCart } = useContext(CartContext);

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handlePayment = () => {
//     // Assume payment processing happens here
//     alert('Payment Done');
//     clearCart();  // Clear the cart after payment
//   };

//   return (
//     <div className='px-4 lg:px-24 py-16'>
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
//         {/* Left side - Cart Items */}
//         <div className='md:col-span-2'>
//           {cart.map(item => (
//             <div key={item._id} className='flex justify-between items-center border-b pb-4 mb-4'>
//               <div>
//                 <h3 className='text-xl font-semibold'>{item.bookTitle}</h3>
//                 <div className='flex items-center'>
//                   <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className='px-3 py-1 bg-gray-300'>-</button>
//                   <span className='px-4'>{item.quantity}</span>
//                   <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className='px-3 py-1 bg-gray-300'>+</button>
//                 </div>
//               </div>
//               <span>${item.price}</span>
//             </div>
//           ))}
//         </div>

//         {/* Right side - Total and Proceed to Payment */}
//         <div className='p-6 bg-blue-100 rounded-lg'>
//           <h3 className='text-2xl font-semibold mb-4'>Total: ${getTotalPrice()}</h3>
//           <button onClick={handlePayment} className='bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg'>
//             Proceed with Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, incrementQuantity, decrementQuantity, totalAmount, processPayment } = useContext(CartContext);

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-24 py-16">
      
      {/* Left Side: Cart Items (2/3 width) */}
      <div className="lg:w-2/3 w-full lg:pr-8 space-y-6">
        <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{item.bookTitle}</h3>
                <p className="text-sm text-gray-600">{item.authorName}</p>
                <p className="text-md font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => decrementQuantity(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  -
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => incrementQuantity(item.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Side: Total and Payment (1/3 width) */}
      <div className="lg:w-1/3 w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="text-lg font-semibold mb-6">
          Total Amount: ${totalAmount}
        </div>
        <button 
          onClick={() => {
            processPayment(); 
            alert('Payment done!');
            window.location.reload();
          }}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
