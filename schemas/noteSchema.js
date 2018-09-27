const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        test: {
            type: String
        },
        dateCreate: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = noteSchema;