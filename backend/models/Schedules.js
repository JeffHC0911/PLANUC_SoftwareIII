const { Schema, model } = require('mongoose');

const scheduleSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    details: {
        professor: {type: String},
        classroom: {type: String},
        notes: {type: String},
    }
});

module.exports = model('Schedule', scheduleSchema);
