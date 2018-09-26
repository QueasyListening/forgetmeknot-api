const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT = 11;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,

        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        notes: [
            {
                title: String,
                text: String,
                date: { type: Date, default: Date.now }
            }
        ]
    }
)