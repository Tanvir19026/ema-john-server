const express = require('express')
const app = express();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()

const port = 5000

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


client.connect((err) => {
    const collection = client.db("ema-john-store").collection("products");
    const orderCollection = client.db("ema-john-store").collection("order");
    console.log("server connected");


   app.post('/addProducts',(req,res)=>{
       const products=req.body;
       
       collection.insertOne(products)
       .then(result =>{
        //    console.log(result.insertedCount);
           res.send(result.insertedCount)

       })
   })

  app.get('/products',(req,res)=>{
   collection.find({})
   .toArray((err,documents)=>{
       res.send(documents)
   })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
   })

 app.get('/',(req,res)=>{
     res.send('welcome rafi');
 })


   //onekgolo products
   app.post('/productsByKeys',(req,res)=>{
       const productKeys=req.body;
   collection.find({key:{$in:productKeys}})
   .toArray((err,documents)=>{
    res.send(documents);

   })

   })



   app.post('/addOrder',(req,res)=>{
    const order=req.body;
    
    orderCollection.insertOne(order)
    .then(result =>{
     //    console.log(result.insertedCount);
        res.send(result.insertedCount>0)

    })
})


})




app.listen(process.env.PORT || port);