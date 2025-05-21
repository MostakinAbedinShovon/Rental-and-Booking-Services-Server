const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Data Sended.");
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.glst95z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("Rental_and_Booking_Services").collection("users");
    
    //Create In The Time Of Registration (users)
    app.post('/users', async(req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result); 
    })

    //For Booked Items
    const bookingCollection = client.db("Rental_and_Booking_Services").collection("Booked_items");
    
    //Getting Data from Database
    app.get('/bookedItems', async(req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result)
    })
    
    //Create In The Time Of Registration (users)
    app.post('/bookedItems', async(req, res) => {
      const item = req.body;
      const result = await bookingCollection.insertOne(item);
      res.send(result); 
    })

    //Create In The Time Of Post Professional Data (professionalsData)
    const professionalsData = client.db("Rental_and_Booking_Services").collection("professionals_data")
    app.post('/professionals', async(req, res) => {
      const professionals = req.body;
      const result = await professionalsData.insertOne(professionals);
      res.send(result); 
    })


    //Create In The Time Of Post Rental Products Data (rental_products_data)
    const rentalProductsData = client.db("Rental_and_Booking_Services").collection("rental_products_data")
    app.post('/rentalProducts', async(req, res) => {
      const rentalProducts = req.body;
      const result = await rentalProductsData.insertOne(rentalProducts);
      res.send(result); 
    })

    //Getting Data from Database
    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    //Getting Specific Data from Database
    app.get('/users/:id', async(req, res) => {
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await usersCollection.findOne(filter);
      res.send(result)
    })

    //Getting Specific Professionals Data from Database
    app.get('/professionalsData/:id', async(req, res) => {
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await professionalsData.findOne(filter);
      res.send(result)
    })

    //Getting Specific Professionals Data from Database
    app.delete('/professionalsData/:id', async(req, res) => {
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await professionalsData.deleteOne(filter);
      res.send(result)
    })

    //Getting Professionals Data from Database
    app.get('/professionalsData', async(req, res) => {
      const result = await professionalsData.find().toArray();
      res.send(result)
    })

    //Getting Rental Products Data from Database
    app.get('/rentalProductsData', async(req, res) => {
      const result = await rentalProductsData.find().toArray();
      res.send(result)
    })

    //Getting Specific Data from Database
    app.put('/users/:id', async(req, res) => {
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateUser = req.body;
      const updateDoc = { $set: updateUser };
      const result = await usersCollection.updateOne(filter,updateDoc,options);
      res.send(result)
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

