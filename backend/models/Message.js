const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);