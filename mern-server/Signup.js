// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("UserAuth").collection("users");

    // Signup route
    app.post("/signup", async (req, res) => {
      const { name, email, password } = req.body;

      try {
        // Check if the user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = {
          name: name,
          email: email,
          password: hashedPassword
        };

        // Save the new user to the database
        await userCollection.insertOne(newUser);

        // Generate a JWT token
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the user data and token
        res.status(201).json({ user: newUser, token, message: "Signup successful", status: true });
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
