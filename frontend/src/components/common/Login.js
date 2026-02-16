import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            alert(res.data.message);
            
            // Save user info to local storage so we know they are logged in
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect based on user type
            if (res.data.user.userType === 'Admin') {
                navigate('/admin-dashboard');
            } else if (res.data.user.userType === 'Agent') {
                navigate('/agent-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="mt-3 text-center">
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;