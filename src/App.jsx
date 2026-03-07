import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import TreasurerDashboard from './pages/Treasurer/Dashboard';
import ManagerDashboard from './pages/Manager/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes Simulation */}
                <Route path="/treasurer/*" element={
                    <MainLayout role="treasurer">
                        <Routes>
                            <Route index element={<TreasurerDashboard />} />
                        </Routes>
                    </MainLayout>
                } />

                <Route path="/manager/*" element={
                    <MainLayout role="manager">
                        <Routes>
                            <Route index element={<ManagerDashboard />} />
                        </Routes>
                    </MainLayout>
                } />

                <Route path="/admin/*" element={
                    <MainLayout role="admin">
                        <Routes>
                            <Route index element={<AdminDashboard />} />
                        </Routes>
                    </MainLayout>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
