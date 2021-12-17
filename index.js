const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.Port || 5000

app.use(cors())

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzm3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majorit`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run(){
    try{
        await client.connect()
        const database = client.db('creativeAgency')
        const serviceCollection = database.collection("services")

        //Get services api
        app.get('/services', async(req,res)=>{
         const cursor = serviceCollection.find({})
         const services = await cursor.toArray()
         res.send(services)
        })
    }
    finally{
    //   await client.close()
    }
}

app.get('/', (req, res) => {
  res.send('Hello Creative Agency!')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})