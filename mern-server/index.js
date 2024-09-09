const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB connection
const uri = process.env.MONGO_URI || "mongodb+srv://demo-store:45121556Aa@cluster0.pmwdn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Create collections
    const bookCollections = client.db("BookInventory").collection("books");
    const blogCollections = client.db("BlogDatabase").collection("blogs");
    const userCollection = client.db("UserAuth").collection("users");
    const cartCollections = client.db("BookInventory").collection("carts");

    // Insert a book to the DB: POST method
    app.post("/upload-book", async (req, res) => {
      console.log("Request received:", req.body);
      try {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        console.log("Insert result:", result);
        res.status(201).send({
          message: 'Book uploaded successfully',
          bookId: result.insertedId
        });
      } catch (error) {
        console.error('Failed to upload book:', error);
        res.status(500).send({ message: 'Failed to upload book' });
      }
    });

    // Get all books from the database
    app.get("/all-books", async (req, res) => {
      try {
        const books = await bookCollections.find().toArray();
        res.status(200).send(books);
      } catch (error) {
        console.error('Failed to retrieve books:', error);
        res.status(500).send({ message: 'Failed to retrieve books' });
      }
    });

    // Update a book data: PATCH method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBooks = req.body;
      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { ...updateBooks },
        };
        const options = { upsert: true };
        const result = await bookCollections.updateOne(filter, updateDoc, options);
        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to update book:', error);
        res.status(500).send({ message: 'Failed to update book' });
      }
    });

    // Delete an item from DB
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const result = await bookCollections.deleteOne(filter);
        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to delete book:', error);
        res.status(500).send({ message: 'Failed to delete book' });
      }
    });

    // Get a single book data
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const result = await bookCollections.findOne(filter);
        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to retrieve book:', error);
        res.status(500).send({ message: 'Failed to retrieve book' });
      }
    });

    // POST: Add a new blog
    app.post("/add-blog", async (req, res) => {
      const blog = req.body;
      try {
        const result = await blogCollections.insertOne(blog);
        res.status(201).send({
          message: 'Blog added successfully',
          blogId: result.insertedId
        });
      } catch (error) {
        console.error('Failed to add blog:', error);
        res.status(500).send({ message: 'Failed to add blog' });
      }
    });

    // GET: Fetch all blogs
    app.get("/all-blogs", async (req, res) => {
      try {
        const blogs = await blogCollections.find().toArray();
        res.status(200).send(blogs);
      } catch (error) {
        console.error('Failed to retrieve blogs:', error);
        res.status(500).send({ message: 'Failed to retrieve blogs' });
      }
    });

    // PATCH: Update a blog
    app.patch("/update-blog/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updateData };

        console.log('Attempting to update blog with id:', id);
        console.log('Filter:', filter);
        console.log('Update Document:', updateDoc);

        const result = await blogCollections.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          console.log('No blog matched the provided ID');
          return res.status(404).send({ message: 'Blog not found' });
        }

        console.log('Update operation successful:', result);
        res.status(200).send(result);
      } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send({ message: 'Failed to update blog' });
      }
    });

    // DELETE: Remove a blog
    app.delete("/delete-blog/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const filter = { _id: new ObjectId(id) };
        const result = await blogCollections.deleteOne(filter);
        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to delete blog:', error);
        res.status(500).send({ message: 'Failed to delete blog' });
      }
    });

    // Signup route
    app.post("/signup", async (req, res) => {
      const { name, email, password } = req.body;
      try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
          name,
          email,
          password: hashedPassword
        };

        await userCollection.insertOne(newUser);

        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user: newUser, token, message: "Signup successful", status: true });
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Login route
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      try {
        const existingUser = await userCollection.findOne({ email });
        if (!existingUser) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ user: existingUser, token, message: "Login successful", status: true });
      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Create or update a cart with new items without replacing the old ones
    app.post('/cart', async (req, res) => {
      const { userId, items } = req.body;
      try {
        const existingCart = await cartCollections.findOne({ userId });

        if (existingCart) {
          // Add new items to the existing cart
          const updatedItems = [...existingCart.items, ...items];
          const result = await cartCollections.updateOne(
            { userId },
            { $set: { items: updatedItems } }
          );
          res.status(200).send({ message: 'Cart updated successfully', result });
        } else {
          // Create a new cart if none exists
          const result = await cartCollections.insertOne({ userId, items });
          res.status(201).send({ message: 'Cart created successfully', result });
        }
      } catch (error) {
        console.error('Failed to handle cart:', error);
        res.status(500).send({ message: 'Failed to handle cart' });
      }
    });

  } finally {
    // Uncomment to close the client connection when the server is shut down
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
