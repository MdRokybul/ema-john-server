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
  const orders = client.db("emaJohnStore").collection("orders");

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
        products.insertOne(product)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount)
        })
    })

    app.post('/addOrders', (req, res) => {
        const order = req.body;
        orders.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    
  
});


app.listen(process.env.PORT || 5000);