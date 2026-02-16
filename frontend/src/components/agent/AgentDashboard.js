import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [agentName, setAgentName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.userType !== 'Agent') {
            navigate('/'); // Redirect if not Agent
        } else {
            setAgentName(user.name);
            fetchAssignedTasks(user.id);
        }
    }, [navigate]);

    const fetchAssignedTasks = async (agentId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/complaints/assigned-to-me/${agentId}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks");
        }
    };

    const markResolved = async (complaintId) => {
        try {
            // Update the Complaint Status to "Resolved"
            await axios.put(`http://localhost:5000/api/complaints/update/${complaintId}`, {
                status: 'Resolved'
            });
            alert("Complaint Marked as Resolved!");
            
            // Reload the list
            const user = JSON.parse(localStorage.getItem('user'));
            fetchAssignedTasks(user.id);
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Agent Dashboard - Welcome, {agentName}</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Your Assigned Tasks</h5>
                </div>
                <div className="card-body">
                    {tasks.length === 0 ? (
                        <p>No pending tasks assigned to you yet.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Complaint Title</th>
                                    <th>Details</th>
                                    <th>Current Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id}>
                                        {/* Accessing the populated complaint details */}
                                        <td>{task.complaintId ? task.complaintId.name : 'Unknown'}</td>
                                        <td>
                                            <strong>Issue:</strong> {task.complaintId.comment}<br/>
                                            <strong>Location:</strong> {task.complaintId.city}, {task.complaintId.state}
                                        </td>
                                        <td>
                                            <span className={`badge ${task.complaintId.status === 'Resolved' ? 'bg-success' : 'bg-primary'}`}>
                                                {task.complaintId.status}
                                            </span>
                                        </td>
                                        <td>
                                            {task.complaintId.status !== 'Resolved' && (
                                                <button 
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => markResolved(task.complaintId._id)}
                                                >
                                                    Mark as Resolved
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;