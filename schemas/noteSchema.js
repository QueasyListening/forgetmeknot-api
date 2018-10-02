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
// @TODO Fix this so it only updates last modified if the note is changed 
noteSchema.pre('save', function(next) {
    if (this.isModified()){
        this.lastModified = Date.now();
    }
    next();
});

module.exports = noteSchema;