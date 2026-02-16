const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the User who posted it
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    comment: { type: String, required: true }, // The description of the issue
    status: { 
        type: String, 
        default: 'Pending' // Complaints start as "Pending"
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);