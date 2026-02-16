const mongoose = require('mongoose');

const AssignedSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    agentName: { type: String },
    status: { type: String, default: 'Assigned' }
});

module.exports = mongoose.model('Assigned', AssignedSchema);