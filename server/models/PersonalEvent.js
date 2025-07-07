const mongoose = require('mongoose');

const personalEventSchema = new mongoose.Schema({
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
        default: 'Personal Event'
    },
    isRSVPRequired: {
        type: Boolean,
        required: true
    },
    files: {
        type: [String],
        required: false
    },
    // User tracking fields - required for personal events
    createdBy: {
        type: String,
        required: true
    },
    createdByEmail: {
        type: String,
        required: true
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
personalEventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const PersonalEvent = mongoose.model('PersonalEvent', personalEventSchema);
module.exports = PersonalEvent; 