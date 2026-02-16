const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// IMPORT ROUTES
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints'); // <--- ADD THIS LINE (Line A)

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// USE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes); // <--- ADD THIS LINE (Line B)

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/complaint_system')
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello! The Complaint System Backend is Working!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});