import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Board from './pages/Board';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import AIInsights from './pages/AIInsights';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useState } from 'react';

function Layout() {
    const { sidebarCollapsed } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
            {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
            <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/board" element={<Board />} />
                <Route path="/board/:projectId" element={<Board />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/team" element={<Team />} />
                <Route path="/ai" element={<AIInsights />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
