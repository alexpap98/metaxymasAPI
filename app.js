const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.URI;
const Item = require('./models/menu.model.js')
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require("fs");
const port = process.env.PORT;


const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/menu', async (req, res) => {
    try {
        const items = await Item.find({})
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// app.post('/add/:type', async (req, res) => {
//     try {
//         let newItem = req.body.item;
//         newItem.type = req.params.type;
//         const checkItem = await Item.create(newItem);
//         res.status(200).json(checkItem);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// })

app.get('/images/:path', (req, res) => {
    let imgPath = req.params.path
    const img = path.join(__dirname, 'images', imgPath);
    console.log("img");
    if (fs.existsSync(img)) {
        res.sendFile(img);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

mongoose.connect(uri).then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log(`Menu server running on port ${port}`)
    })
}).catch(() => {
    console.log("Connection Failed ");
})





