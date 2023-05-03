const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port = process.env.Port || 5000

//Cors policy
app.use(cors())
app.use(express.json())

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzm3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("creativeAgency");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("review");
    const usersCollection = database.collection("users");

    //get services api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //GET API for get all services by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });
    // GET API (get all orders)
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // POST API for posting the user's orders into database
    app.post("/placeOrder", async (req, res) => {
      const orderDetails = req.body;
      console.log(orderDetails);
      const result = await orderCollection.insertOne(orderDetails);
      res.json(result);
    });
    // GET API (get orders by email)
    app.get("/myOrders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await orderCollection.find(query);
      const myOrders = await cursor.toArray();
      res.send(myOrders);
    });

    // DELETE API for deleting a single order
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    //GET Review API for getting all the review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });
    // POST API for adding a review to homepage
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
    //PUT method for make single user to admin
    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.findOne(filter).toArray();
      if (result) {
        const documents = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
        console.log(documents);
      }
      
    });
    //add new user to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
 //POST API for posting firebase users into mongodb database
  app.post("/addUserInfo", async (req, res) => {
    console.log("req.body");
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });
  //POST API for adding new service
  app.post("/services", async(req,res)=>{
    const service = req.body
    const result = await serviceCollection.insertOne(service)
    console.log(result);
    res.json(result)
  })
    // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await usersCollection
        .find({ email: req.params.email })
        .toArray();
      // console.log(result);
      res.send(result);
    });
    // DELETE API (delete product by id)
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cycleCollection.deleteOne(query);
      res.json(result);
    });
    // PUT API for approving the orders by admin
    app.put("/approve/:id", async (req, res) => {
      const id = req.params.id;
      const approvedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: approvedOrder.status,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } 
  finally {
    //await client.close()
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello creative agency!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});