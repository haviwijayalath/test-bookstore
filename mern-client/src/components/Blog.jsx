import React, { useState, useEffect } from 'react';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', date: '', summary: '', fullContent: '' });
  const [editMode, setEditMode] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  // Fetch all blogs
  useEffect(() => {
    fetch('http://localhost:5000/all-blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  // Handle input for new blog
  const handleInput = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  // Add a new blog
  const addBlog = () => {
    fetch('http://localhost:5000/add-blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog),
    })
      .then(res => res.json())
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };

  // Edit blog
  const saveEditBlog = (id) => {
    fetch(`http://localhost:5000/update-blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editBlog),
    })
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };

  // Delete blog
  const deleteBlog = (id) => {
    fetch(`http://localhost:5000/delete-blog/${id}`, { method: 'DELETE' })
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };

  // Toggle blog expansion
  const toggleBlog = (id) => {
    setExpandedBlog(expandedBlog === id ? null : id);
  };

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-24 py-16">
      
      {/* Left Side: Blog View (2/3 width) */}
      <div className="lg:w-2/3 w-full lg:pr-8 space-y-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="p-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-700">{blog.title}</h3>
            <p className="text-sm text-gray-600">{blog.date}</p>
            <p className="mt-4">{blog.summary}</p>

            {/* Conditionally show full content if expanded */}
            {expandedBlog === blog._id && (
              <p className="mt-4 text-gray-800">{blog.fullContent}</p>
            )}

            {/* "View more" or "Show less" toggle */}
            <button
              onClick={() => toggleBlog(blog._id)}
              className="text-blue-700 hover:underline mt-4 block"
            >
              {expandedBlog === blog._id ? 'Show less' : 'View more'}
            </button>

            <button
              onClick={() => deleteBlog(blog._id)}
              className="text-red-500 hover:underline mt-4 block"
            >
              Delete
            </button>

            <button
              onClick={() => {
                setEditMode(blog._id);
                setEditBlog(blog);
              }}
              className="text-green-500 hover:underline mt-4 block"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Right Side: Blog Form (1/3 width) */}
      <div className="lg:w-1/3 w-full bg-white p-6 rounded-lg shadow-lg">
        {editMode ? (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit Blog</h3>
            <input
              name="title"
              value={editBlog.title}
              onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Title"
            />
            <input
              name="date"
              value={editBlog.date}
              onChange={(e) => setEditBlog({ ...editBlog, date: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Date"
            />
            <input
              name="summary"
              value={editBlog.summary}
              onChange={(e) => setEditBlog({ ...editBlog, summary: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Summary"
            />
            <textarea
              name="fullContent"
              value={editBlog.fullContent}
              onChange={(e) => setEditBlog({ ...editBlog, fullContent: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Content"
            />
            <button
              onClick={() => saveEditBlog(editMode)}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4">Add New Blog</h3>
            <input
              name="title"
              onChange={handleInput}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Title"
            />
            <input
              name="date"
              onChange={handleInput}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Date"
            />
            <input
              name="summary"
              onChange={handleInput}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Summary"
            />
            <textarea
              name="fullContent"
              onChange={handleInput}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Content"
            />
            <button
              onClick={addBlog}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
