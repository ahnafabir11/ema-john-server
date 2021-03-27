const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello, Welcome to Ema-Jhon server');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swwce.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCol = client.db(`${process.env.DB_NAME}`).collection("products");
  const ordersCol = client.db(`${process.env.DB_NAME}`).collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCol.insertMany(products)
      .then(result => {
        console.log(result.insertedCount);
        res.status(200).send(result.insertedCount);
      })
  })

  app.get('/products', (req, res) => {
    productsCol.find({}).limit(20)
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:key', (req, res)=> {
    const productKey = req.params.key;
    productsCol.find({ key: productKey })
    .toArray((err, document)=> {
      res.send(document)
    })
  })

  app.post('/productsByKeys', (req, res)=> {
    const productKeys = req.body;
    console.log(productKeys);
    productsCol.find({ key: { $in: productKeys}})
      .toArray((err, documents)=> {
        res.send(documents)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCol.insertOne(order)
      .then(result => {
        res.status(200).send(result.insertedCount > 0);
      })
  })

});


app.listen(port);