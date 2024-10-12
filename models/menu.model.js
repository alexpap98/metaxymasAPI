const mongoose = require("mongoose");

// Define the schema for each item in the items array
const ItemDetailsSchema = new mongoose.Schema({
    key:{
        type: String,
        required: true
    },
    name: {
        type: Object,
        required: true,
        en: {
            type: String,
            required: false
        },
        gr: {
            type: String,
            required: [true, "Add at least Greek!"]
        }
    },
    val: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        default: 0,
        required: false
    },
    image: {
        type: String,
        required: false
    }
});

// Main schema that includes the category and items
const ItemSchema = new mongoose.Schema(
    {
        category: {
            type: Object,
            required: true,
            en: {
                type: String,
                required: false
            },
            gr: {
                type: String,
                required: [true, "Add at least Greek!"]
            }
        },
        items: {
            type: [ItemDetailsSchema], // Use the defined ItemDetailsSchema
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
