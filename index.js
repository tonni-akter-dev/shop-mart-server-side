const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://shop-mart:PORPhpsCezyW6Uye@cluster0.qtpo1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
    const reviewCollection = database.collection("review");
    const allOrderCollection = database.collection("allOrder");

    // all order products get ==============================================
    app.get("/allOrder", async (req, res) => {
      const products = await allOrderCollection.find({}).toArray();
      res.send(products);
    });

    //all order Product post===============================================
    app.post("/addToCartProduct", async (req, res) => {
      const product = req.body;
      const result = await allOrderCollection.insertOne(product);
      res.json(result);
    });
    // email get my Order==============================================
    app.get("/myOrder/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const myOrder = await allOrderCollection.find(query).toArray();
      res.send(myOrder);
    });
    // my order delete ==================================================
    app.delete("/myOrderDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allOrderCollection.deleteOne(query);
      res.send(result);
    });
    // Delete manage all product ========================================
    app.delete("/manageAllOrderDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allOrderCollection.deleteOne(query);
      res.send(result);
    });
    // status Update ==================================================
    app.put("/statusUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const statusColor = req.body.statusColor;
      const filter = { _id: ObjectId(id) };
      await allOrderCollection
        .updateOne(filter, {
          $set: {
            status: status,
            statusColor: statusColor,
          },
        })
        .then((result) => {
          res.send(result);
        });
    });

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
    app.get("/homeProducts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await homeAllCollection.findOne(query);
      res.json(result);
    });

    app.get("/homeproducts", async (req, res) => {
      const cursor = homeAllCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
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
