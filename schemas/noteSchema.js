const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String
        },
        dateCreate: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type:Date,
            default: Date.now
        }
    }
)

noteSchema.pre('save', function(next) {
    this.lastModified = Date.now();
    next();
});

module.exports = noteSchema;