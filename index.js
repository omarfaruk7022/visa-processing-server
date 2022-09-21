const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gw1a0fp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const userCollection = client.db("visa-processing").collection("users");
    const companyCollection = client
      .db("visa-processing")
      .collection("companies");
    const completedCollection = client
      .db("visa-processing")
      .collection("completed");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      res.send({ data: user });
    });
    app.put("/companies", async (req, res) => {
      const company = req.body;
      const result = await companyCollection.insertOne(company);
      res.send(result);
    });
    app.get("/companies", async (req, res) => {
      const companies = await companyCollection.find({}).toArray();
      res.send(companies);
    });
    app.get("/companies/:id", async (req, res) => {
      const id = req.params.id;
      const company = await companyCollection.findOne({ _id: ObjectId(id) });
      res.send(company);
    });
    app.patch("/companies/:id", async (req, res) => {
      const id = req.params.id;
      const company = req.body;
      const result = await companyCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: company }
      );
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    });
    app.post("/completed", async (req, res) => {
      const completed = req.body;
      const result = await completedCollection.insertOne(completed);
      res.send(result);
    });
    app.get("/completed", async (req, res) => {
      const completed = await completedCollection.find({}).toArray();
      res.send(completed);
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Visa processing");
});

app.listen(port, () => {
  console.log(`Visa processing listening on port ${port}`);
});
