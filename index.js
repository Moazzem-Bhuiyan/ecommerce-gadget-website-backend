const express = require('express');
const app = express()
const port = 5000
const cors = require("cors")


// midleware

app.use (cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const uri = "mongodb+srv://gadgetweb:8E0f1vNWvJqJD4Ny@cluster0.7kns6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = 'mongodb://localhost:27017'

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

    // collection type start----

    const cartsCollection = client.db("gadgetdb").collection("carts")

    const cartsaddCollection = client.db("gadgetdb").collection("cartsadd")
    const userCollection = client.db("gadgetdb").collection("users")
    const userinfoCollection = client.db("gadgetdb").collection("usersinfo")

    // userinfo saved data base 

    app.post('/usersinfo',async (req, res) => {
      const userinfo =req.body;
      const result = await userinfoCollection.insertOne(userinfo)
      res.send(result)
      
    });



    // users related api start 

    app.post('/user',async(req,res)=>{

      const user =req.body;

      const result = await userCollection.insertOne(user);
      res.send(result)
    })


    // carts /menu related Api ---
    app.get('/carts', async(req, res) => {

       try {
        const  result= await cartsCollection.find().toArray();
        res.send(result)
        
       } catch (error) {
        
        console.log('error' ,error)
       }
        
    });


    // real carts related apii

    app.post('/cartsadd', async(req, res) => {

        const cartItem = req.body

        const result = await cartsaddCollection.insertOne(cartItem)
        res.send(result)
        
    });

    // ui te cart dekhanor jnno api

    app.get('/cartsadd',async (req, res) => {
        
        const result = await cartsaddCollection. find().toArray()
        res.send(result)
        
    });

    app.delete('/cartsadd/:id',async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId (id)};
        const result = await cartsaddCollection.deleteOne(query)
        res.send(result);
        
    });




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// basic setup

app.get('/', (req, res) => {
    res.send('Server Is Ruuning ')
    
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
