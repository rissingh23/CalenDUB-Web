const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    allDay: {
        type: Boolean,
        required: true
    },
    recurring: {
        type: String,
        required: false
    },
    endsOption: {
        type: String,
        required: false
    },
    endsAfterCount: {
        type: Number,
        required: false
    },
    endsOnDate: {
        type: Date,
        required: false
    },
    isInPerson: {
        type: Boolean,
        required: true
    },
    isVirtual: {
        type: Boolean,
        required: true
    },
    isHybrid: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    eventType: {
        type: String,
        required: false,
        default: 'UW Event'
    },
    isRSVPRequired: {
        type: Boolean,
        required: true
    },
    files: {
        type: [String],
        required: false
    },
    // User tracking fields
    createdBy: {
        type: String,
        required: false // Make optional for backward compatibility
    },
    createdByEmail: {
        type: String,
        required: false // Make optional for backward compatibility
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
