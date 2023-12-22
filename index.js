const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybqjzfh.mongodb.net/?retryWrites=true&w=majority`;

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
    // ------------------------------------
    const usersCollection = client.db('taskDB').collection('users');
    const tasksCollection = client.db('taskDB').collection('tasks');
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const userExist = await usersCollection.findOne(query);
      if (userExist) {
        return res.send({ message: 'user already exist', insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.post('/tasks', async(req,res)=>{
      const task= req.body;
      const result= await tasksCollection.insertOne(task);
      res.send(result);
    });
    app.get('/tasks', async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });
    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email }
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    // ------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('CRUD is running');
});
app.listen(port, () => {
  console.log(`App is running on port, ${port}`);
});