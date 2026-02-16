const express = require('express');
const Complaint = require('../models/Complaint'); // Import Complaint Model
const Assigned = require('../models/Assigned');   // Import Assigned Model

const router = express.Router();

// 1. CREATE A COMPLAINT
router.post('/add', async (req, res) => {
    try {
        const { userId, name, address, city, state, pincode, comment } = req.body;

        const newComplaint = new Complaint({
            userId,
            name,
            address,
            city,
            state,
            pincode,
            comment,
            status: "Pending" // Default status
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint Registered Successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error adding complaint", error: error.message });
    }
});

// 2. GET ALL COMPLAINTS (For Admin)
router.get('/all', async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('userId', 'name email'); 
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 3. GET COMPLAINTS BY USER ID (For User Dashboard)
router.get('/user/:userId', async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.params.userId });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 4. UPDATE COMPLAINT STATUS (For Agent/Admin)
router.put('/update/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await Complaint.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Status Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

// 5. ASSIGN COMPLAINT TO AGENT (For Admin)
router.post('/assign', async (req, res) => {
    try {
        const { complaintId, agentId, agentName } = req.body;

        // Create the Assignment Record
        const newAssignment = new Assigned({
            complaintId,
            agentId,
            agentName,
            status: "Assigned"
        });
        await newAssignment.save();

        // Update the Complaint Status to "Assigned"
        await Complaint.findByIdAndUpdate(complaintId, { status: "Assigned" });

        res.json({ message: "Complaint Assigned Successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error assigning complaint" });
    }
});

// 6. GET TASKS ASSIGNED TO A SPECIFIC AGENT (For Agent Dashboard)
router.get('/assigned-to-me/:agentId', async (req, res) => {
    try {
        // Find all assignments for this agent and get the full complaint details
        const assignments = await Assigned.find({ agentId: req.params.agentId })
                                          .populate('complaintId')
                                          .populate('agentId'); 
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

module.exports = router;