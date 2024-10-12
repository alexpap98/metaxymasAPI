const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.URIme;
const Item = require('./models/menu.model.js')
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require("fs");
const port = process.env.PORT;
// const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authentication = require("./middleware/auth.js");
const Users = require('./models/user.model.js');
const app = express();

// app.use(bodyParser.json({ limit: '20mb' }));
// app.use(bodyParser.urlencoded({ extended: false }));

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


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('====================================');
    console.log(username, password);
    console.log('====================================');
    try {
        // Find the user by username and password
        const user = await Users.findOne({ username: username, password: password });

        if (!user) {
            return res.status(404).send('User not found or incorrect password');
        }
        const userInfo = {
            "name": "Lazos",
            "username": username
        }
        const signedToken = jwt.sign(userInfo, process.env.SECRET);
        // If user is found, send a success response
        res.json(signedToken);
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});



app.post('/updateItem/:id', authentication, async (req, res) => {
    const itemId = req.params.id;
    const newItem = req.body.newItem;
    const itemID = newItem._id;
    console.log(req.body);
    console.log(itemId);

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            console.log('Item not found');
            return;
        }
        const existingItemIndex = item.items.findIndex(i => i._id.toString() === itemID?.toString());

        if (existingItemIndex !== -1) {
            item.items[existingItemIndex] = newItem;
        } else {
            item.items.push(newItem);
        }

        const category = await item.save();
        res.json({ message: 'Item added or updated successfully', category: category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating or adding item" });
    }

})
app.delete('/delete/:id/:itemID', authentication, async (req, res) => {
    const categoryID = req.params.id;
    const itemID = req.params.itemID;
    try {
        // Find the document by its ID
        const item = await Item.findById(categoryID);

        if (!item) {
            console.log('Item not found');
            return;
        }

        // Filter out the item with the matching key
        console.log(categoryID);
        console.log(itemID);

        item.items = item.items.filter(i => {
            console.log(i._id.toString(), itemID.toString());
            return i._id.toString() !== itemID.toString()
        });

        // Save the updated item document
        await item.save();
        console.log('Item deleted successfully');
        res.json({ message: 'Item deleted successfully' });

    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: "Error deleting item" });

    }

})

const uploads = express.Router();


uploads.use(authentication);

require('./router/uploads.js')(uploads);

app.use('/upload', uploads);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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





