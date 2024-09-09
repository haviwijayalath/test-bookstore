import React from 'react';
import { Sidebar } from 'flowbite-react';
import { Outlet } from 'react-router-dom';
import { HiOutlineCloudUpload, HiUser, HiShoppingBag } from 'react-icons/hi';

const DashboardLayout = () => {
  return (
    <div className='flex flex-col md:flex-row'>
      <Sidebar aria-label="Sidebar with content separator example" className="bg-gray-700 text-gray-200 w-64 h-auto shadow-lg">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/dashboard/upload"
              icon={HiOutlineCloudUpload}
              className="py-4 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Upload a Book
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard/manage"
              icon={HiUser}
              className="py-4 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Manage Book
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              icon={HiShoppingBag}
              className="py-4 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Products
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <main className='flex-1 p-6 bg-gray-800 text-gray-200 min-h-screen'>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
