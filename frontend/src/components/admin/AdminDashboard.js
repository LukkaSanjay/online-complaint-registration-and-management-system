import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState({}); // Stores selected agent for each complaint row

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.userType !== 'Admin') {
            navigate('/'); // Redirect if not Admin
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            // Get All Complaints
            const complaintRes = await axios.get('http://localhost:5000/api/complaints/all');
            setComplaints(complaintRes.data);

            // Get All Agents
            const agentRes = await axios.get('http://localhost:5000/api/auth/getAllAgents');
            setAgents(agentRes.data);
        } catch (err) {
            console.error("Error fetching data");
        }
    };

    const handleAssign = async (complaintId) => {
        const agentId = selectedAgent[complaintId];
        if (!agentId) {
            alert("Please select an agent first!");
            return;
        }

        // Find the agent's name from the list
        const agent = agents.find(a => a._id === agentId);

        try {
            await axios.post('http://localhost:5000/api/complaints/assign', {
                complaintId,
                agentId,
                agentName: agent.name
            });
            alert("Complaint Assigned Successfully!");
            fetchData(); // Refresh list to show updated status
        } catch (err) {
            alert("Failed to assign agent.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Admin Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">All User Complaints</h5>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>User</th>
                                <th>Complaint</th>
                                <th>Status</th>
                                <th>Assign To Agent</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.userId ? c.userId.name : 'Unknown'}</td>
                                    <td>
                                        <strong>{c.name}</strong><br/>
                                        <small>{c.comment}</small>
                                    </td>
                                    <td>
                                        <span className={`badge ${c.status === 'Resolved' ? 'bg-success' : c.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Show Dropdown ONLY if status is Pending */}
                                        {c.status === 'Pending' ? (
                                            <select 
                                                className="form-select"
                                                onChange={(e) => setSelectedAgent({ ...selectedAgent, [c._id]: e.target.value })}
                                            >
                                                <option value="">Select Agent</option>
                                                {agents.map(agent => (
                                                    <option key={agent._id} value={agent._id}>
                                                        {agent.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-muted">Already Assigned</span>
                                        )}
                                    </td>
                                    <td>
                                        {c.status === 'Pending' && (
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAssign(c._id)}
                                            >
                                                Assign
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;