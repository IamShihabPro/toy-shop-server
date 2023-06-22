const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgdhrpf.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();


    const toyShopCollection = client.db('toyShopDB').collection('toyShop')


    app.post('/addtoys', async(req, res)=>{
      const body = req.body
      console.log(body);
      const result = await toyShopCollection.insertOne(body)
      res.send(result)
    })

    app.get('/alltoys', async (req, res)=>{
      const result = await toyShopCollection.find().toArray()
      res.send(result)
    })

    app.get('/alltoys/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await toyShopCollection.findOne(query)
      res.send(result)
    })


    app.delete('/alltoys/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await toyShopCollection.deleteOne(query)
      res.send(result)
    })


    app.get('/alltoys/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await toyShopCollection.findOne(query)
      res.send(result)
    })

    app.patch('/alltoys/:id', async (req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const toyData = req.body
      const toys = {
        $set: {
          category : toyData.category,
          subCategory: toyData.subCategory,
           name: toyData.name,
           price: toyData.price,
           likes: toyData.likes,
           rating: toyData.rating,
           photoURL: toyData.photoURL,
           email: toyData.email,
           date: toyData.date,
        }
      }
      const result = await toyShopCollection.updateOne(filter, toys, options)
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




app.get('/', (req, res)=>{
    res.send("all is well")
})
app.listen(port, ()=>{
    console.log(`Port is running on ${port}`);
})

