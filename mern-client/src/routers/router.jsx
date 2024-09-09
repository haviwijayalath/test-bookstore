import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from '../App.jsx';
import Home from '../home/Home.jsx';
import Shop from '../shop/Shop.jsx';
import About from '../components/About.jsx';
import Blog from '../components/Blog.jsx';
import DashboardLayout from '../dashboard/DashboardLayout.jsx';
import ManageBook from '../dashboard/ManageBook.jsx'; 
import UploadBook from '../dashboard/UploadBook.jsx';
import EditBook from '../dashboard/EditBook.jsx'; 
import SingleBook from '../components/SingleBook.jsx'; 
import Signup from '../components/Signup.jsx';   
import Login from '../components/Login.jsx';
import Cart from '../components/Cart.jsx';     

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/shop',
        element: <Shop />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/book/:bookId',
        element: <SingleBook />,
        loader: async ({ params }) => {
          const response = await fetch(`http://localhost:5000/book/${params.bookId}`);
          if (!response.ok) {
            throw new Response('Failed to fetch book', { status: response.status });
          }
          return response.json();
        }
      },
      {
          path: '/cart',
          element: <Cart />,
        },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "manage",
            element: <ManageBook />
          },
          {
            path: "upload",
            element: <UploadBook />
          },
          {
            path: "edit-books/:bookId",
            element: <EditBook />,
            loader: async ({ params }) => {
              const response = await fetch(`http://localhost:5000/book/${params.bookId}`); 
              if (!response.ok) {
                throw new Response('Failed to fetch book data for editing', { status: response.status });
              }
              return response.json();
            }
          }
        ]
      },
      {
        path: '/signup',
        element: <Signup />   
      },
      {
        path: '/login',
        element: <Login />     
      }
    ]
  }
]);

export default router;
