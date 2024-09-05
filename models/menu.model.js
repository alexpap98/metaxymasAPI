const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
    {
        category: {
            type: Object,
            en: {
                type: String,
                required: false
            },
            gr: {
                type: String,
                required: [true, "Add at least greek!"]
            }
        },
        items: {
            type: Array,
            required: true,
            name: {
                type: Object,
                en: {
                    type: String,
                    required: false
                },
                gr: {
                    type: String,
                    required: [true, "Add at least greek!"]
                }
            },
            val: {
                type: String,
                required: false,
            },
            price: {
                type: Number,
                default: 0,
                required: false,
            },
            image: {
                type: String,
                required: false,
            },
        },
    },
    {
        timestamps: true
    }
);


const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;