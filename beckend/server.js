const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
app.use(bodyParser.json())
app.use(cors())

const url = process.env.MONGO_URI

const client = new MongoClient(url);
const dbName = 'pass-man'

client.connect()

app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const result = await collection.find({}).toArray()
    res.send(result)
})

app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const result = await collection.insertOne(password)
    res.send({success: true, result: result})
})

app.delete('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const result = await collection.deleteOne(password)
    res.send({success: true, result: result})
})


app.listen(port, () => {
    console.log(`Running on port: http://localhost:${port}`)
})