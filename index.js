const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    //Create In The Time Of Post Professional Data (professionalData)
    const professionalData = client.db("Rental_and_Booking_Services").collection("professionals_data")
    app.post('/professionals', async(req, res) => {
      const professionals = req.body;
      console.log(professionalData);
      const result = await professionalData.insertOne(professionals);
      res.send(result); 
    })

    //Create In The Time Of Post Rental Products Data (rental_products_data)
    const rentalProductsData = client.db("Rental_and_Booking_Services").collection("rental_products_data")
    app.post('/rentalProducts', async(req, res) => {
      const rentalProducts = req.body;
      console.log(professionalData);
      const result = await rentalProductsData.insertOne(rentalProducts);
      res.send(result); 
    })

    //Getting Data from Database
    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
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

