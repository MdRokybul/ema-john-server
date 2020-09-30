require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uyjh9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Hello ema watson!");
});



client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/products', (req, res) => {
        products.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        products.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        products.insertMany(product)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount)
        })
    })

    
  
});


app.listen(5000);