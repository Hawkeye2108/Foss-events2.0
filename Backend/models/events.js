const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    organisation: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('events', eventsSchema);