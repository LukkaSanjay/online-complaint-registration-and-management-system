import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // <--- THIS LINE IS CRITICAL FOR THE IMAGE

// Import Components
import Login from './components/common/Login';
import Register from './components/common/Register';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AgentDashboard from './components/agent/AgentDashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <div className="overlay">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}export default App;