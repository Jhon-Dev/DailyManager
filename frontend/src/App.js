import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import SignupPage from './pages/SignupPage';

function App() {
    const [logado, setLogado] = useState(!!localStorage.getItem('token'));

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={() => setLogado(true)} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to={logado ? "/dashboard" : "/login"} />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;
