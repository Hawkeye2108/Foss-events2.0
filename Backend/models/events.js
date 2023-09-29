const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
})
 
module.exports = mongoose.model('events',eventsSchema);