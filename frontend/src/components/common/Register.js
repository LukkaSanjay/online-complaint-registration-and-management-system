import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        userType: 'Customer' // Default to Customer
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Registration Successful! Please Login.");
            navigate('/');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Full Name</label>
                        <input type="text" name="name" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Phone</label>
                        <input type="text" name="phone" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>User Type</label>
                        <select name="userType" className="form-control" onChange={handleChange}>
                            <option value="Customer">Customer</option>
                            <option value="Agent">Agent</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Register</button>
                    <div className="mt-3 text-center">
                        <p>Already have an account? <Link to="/">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;