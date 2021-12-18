const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

///database connection

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.prbxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("Harley-Davidson");

    const bikesCollection = database.collection("bikes");
    const ordersCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    ///add
    app.post("/bikes", async (req, res) => {
      const newBike = req.body;

      const result = await bikesCollection.insertOne(newBike);
      res.json(result);
    });

    //load
    app.get("/bikes", async (req, res) => {
      const bikes = await bikesCollection.find({}).toArray();
      res.send(bikes);
    });

    app.get("/singleBike/:id", async (req, res) => {
      const id = req.params.id;
      const bike = await bikesCollection.findOne({ _id: ObjectId(id) });
      res.send(bike);
    });

    app.post("/orders", async (req, res) => {
      const newOrder = req.body;

      const result = await ordersCollection.insertOne(newOrder);
      res.json(result);
    });

    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;

      const myOrders = await ordersCollection.find({ email: email }).toArray();
      res.send(myOrders);
    });

    app.get("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikesCollection.findOne(query);
      res.send(result);
      console.log(result, "🤳");
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    app.get("/review", async (req, res) => {
      const reviews = await reviewCollection.find({}).toArray();
      res.send(reviews);
    });

    app.get("/allOrders", async (req, res) => {
      const allOrders = await ordersCollection.find({}).toArray();
      res.send(allOrders);
    });

    app.put("/orders/", async (req, res) => {
      const id = req.query.id;
      const status = req.query.status;

      const filter = { _id: ObjectId(id) };

      const updateDoc = {
        $set: { status: status },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orderDelete = await ordersCollection.deleteOne(query);
      res.send(orderDelete);
    });

    ///load all bike
    app.get("/bikes", async (req, res) => {
      const allOrders = await bikesCollection.find({}).toArray();
      res.send(allOrders);
    });

    ///delete bike
    app.delete("/deleteBike/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bikeDelete = await bikesCollection.deleteOne(query);
      res.send(bikeDelete);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/makeAdmin", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const user = await usersCollection.findOne(filter);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Connected");
});

app.listen(port, () => {
  console.log(`port connected`, port, "👌");
});
