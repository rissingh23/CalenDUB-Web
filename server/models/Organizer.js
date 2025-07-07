const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    picture: {
        type: String
    }
});

const Organizer = mongoose.model('Organizer', organizerSchema);

module.exports = Organizer;