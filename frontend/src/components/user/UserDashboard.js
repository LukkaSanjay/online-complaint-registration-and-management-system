import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        comment: ''
    });

    // 1. Load User & Complaints when page opens
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/'); // If not logged in, go back to login
        } else {
            setUser(storedUser);
            fetchComplaints(storedUser.id);
        }
    }, [navigate]);

    // 2. Function to get complaints from Backend
    const fetchComplaints = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/complaints/user/${userId}`);
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching complaints", err);
        }
    };

    // 3. Handle Form Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Submit New Complaint
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/complaints/add', {
                userId: user.id,
                ...formData
            });
            alert("Complaint Registered Successfully!");
            fetchComplaints(user.id); // Refresh the list
            setFormData({ name: '', address: '', city: '', state: '', pincode: '', comment: '' }); // Clear form
        } catch (err) {
            alert("Error submitting complaint");
        }
    };

    // 5. Logout Function
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome, {user.name}</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div className="row">
                {/* LEFT SIDE: Complaint Form */}
                <div className="col-md-5">
                    <div className="card p-4 shadow">
                        <h4>Register a Complaint</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2"><input name="name" placeholder="Complaint Title/Product Name" className="form-control" onChange={handleChange} value={formData.name} required /></div>
                            <div className="mb-2"><input name="address" placeholder="Address" className="form-control" onChange={handleChange} value={formData.address} required /></div>
                            <div className="row">
                                <div className="col"><input name="city" placeholder="City" className="form-control mb-2" onChange={handleChange} value={formData.city} required /></div>
                                <div className="col"><input name="state" placeholder="State" className="form-control mb-2" onChange={handleChange} value={formData.state} required /></div>
                            </div>
                            <div className="mb-2"><input name="pincode" placeholder="Pincode" type="number" className="form-control" onChange={handleChange} value={formData.pincode} required /></div>
                            <div className="mb-2"><textarea name="comment" placeholder="Describe your issue..." className="form-control" rows="3" onChange={handleChange} value={formData.comment} required></textarea></div>
                            <button type="submit" className="btn btn-primary w-100">Submit Complaint</button>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE: Your Past Complaints */}
                <div className="col-md-7">
                    <div className="card p-4 shadow">
                        <h4>Your Complaint History</h4>
                        {complaints.length === 0 ? (
                            <p className="text-muted">No complaints found.</p>
                        ) : (
                            <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((c) => (
                                            <tr key={c._id}>
                                                <td>{c.name}</td>
                                                <td>{new Date(c.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${c.status === 'Resolved' ? 'bg-success' : c.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;