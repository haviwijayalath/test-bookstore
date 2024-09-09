const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB connection
const uri = "mongodb+srv://demo-store:45121556Aa@cluster0.pmwdn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

    // Create a collection of documents
    const bookCollections = client.db("BookInventory").collection("books");

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
          $set: {
            ...updateBooks
          },
        };
        const options = { upsert: true };
        const result = await bookCollections.updateOne(filter, updateDoc, options);
        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to update book:', error);
        res.status(500).send({ message: 'Failed to update book' });
      }
    });

    // delete a item from db
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        })


        // get a single book data
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.findOne(filter);
            res.send(result)
        })



    // Create a collection for blogs
    const blogCollections = client.db("BlogDatabase").collection("blogs");

    // POST: Add a new blog
    app.post("/add-blog", async (req, res) => {
      const { title, date, summary, fullContent } = req.body;

      // Validate the required fields
      if (!title || !date || !summary || !fullContent) {
        return res.status(400).send({
          message: 'All fields (title, date, summary, fullContent) are required.',
        });
      }

      try {
        const result = await blogCollections.insertOne({ title, date, summary, fullContent });
        res.status(201).send({
          message: 'Blog added successfully',
          blogId: result.insertedId
        });
      } catch (error) {
        res.status(500).send({ message: 'Failed to add blog' });
      }
    });

    // GET: Fetch all blogs
    app.get("/all-blogs", async (req, res) => {
      try {
        const blogs = await blogCollections.find().toArray();
        res.status(200).send(blogs);
      } catch (error) {
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
        const result = await blogCollections.updateOne(filter, updateDoc);
        res.status(200).send(result);
      } catch (error) {
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
        res.status(500).send({ message: 'Failed to delete blog' });
      }
    });




    // // Add the cart collection in MongoDB
    // const cartCollections = client.db("BookInventory").collection("carts");

    // // Create a new cart or update an existing cart
    // app.post('/cart', async (req, res) => {
    //   const { userId, items } = req.body;
    //   try {
    //     const filter = { userId };
    //     const updateDoc = {
    //       $set: { items, status: 'pending' },
    //     };
    //     const result = await cartCollections.updateOne(filter, updateDoc, { upsert: true });
    //     res.status(200).send(result);
    //   } catch (error) {
    //     res.status(500).send({ message: 'Failed to create/update cart' });
    //   }
    // });

    // // Payment endpoint
    // app.post('/payment', async (req, res) => {
    //   const { userId } = req.body;
    //   try {
    //     const filter = { userId };
    //     const updateDoc = { $set: { status: 'paid' } };
    //     const result = await cartCollections.updateOne(filter, updateDoc);
    //     res.status(200).send({ message: 'Payment successful', result });
    //   } catch (error) {
    //     res.status(500).send({ message: 'Payment failed' });
    //   }
    // });

    // Create or update a cart with new items without replacing the old ones
    app.post('/cart', async (req, res) => {
      const { userId, items } = req.body;
      try {
        // Find the user's existing cart
        const existingCart = await cartCollections.findOne({ userId });

        if (existingCart) {
          // Merge new items with the existing cart items
          const updatedItems = [...existingCart.items];

          items.forEach(newItem => {
            // Check if the item already exists in the cart
            const itemIndex = updatedItems.findIndex(item => item.bookId === newItem.bookId);
            
            if (itemIndex > -1) {
              // If the item exists, update its quantity
              updatedItems[itemIndex].quantity += newItem.quantity;
            } else {
              // If the item doesn't exist, add it to the cart
              updatedItems.push(newItem);
            }
          });

          // Update the cart with the combined items
          await cartCollections.updateOne(
            { userId },
            { $set: { items: updatedItems, status: 'pending' } }
          );
          res.status(200).send({ message: 'Cart updated successfully' });
        } else {
          // If the cart doesn't exist, create a new cart
          await cartCollections.insertOne({
            userId,
            items,
            status: 'pending',
          });
          res.status(201).send({ message: 'New cart created successfully' });
        }
      } catch (error) {
        res.status(500).send({ message: 'Failed to create/update cart', error });
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
  console.log(`Example app listening on port ${port}`);
});
