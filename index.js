const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qtpo1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("shop-mart");
    const userCollection = database.collection("users");
    const homeAllCollection = database.collection("homeall");
    const shoesCollection = database.collection("shoes");
    const bagsCollection = database.collection("bags");
    const reviewCollection = database.collection("review");
    // users collection insert a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // admin
    // set user as a admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // // check either user is admin or not 1
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // homeproducts
    // all
    app.get("/homeproducts/all", async (req, res) => {
      const cursor = homeAllCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/homeproducts/shoes", async (req, res) => {
      const cursor = shoesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/homeproducts/bags", async (req, res) => {
      const cursor = bagsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // user review ==================================================
    app.post("/review", async (req, res) => {
      const product = req.body;
      const result = await reviewCollection.insertOne(product);
      res.json(result);
    });
    app.get("/review", async (req, res) => {
      const review = await reviewCollection.find({}).toArray();
      res.send(review);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello tonni");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
