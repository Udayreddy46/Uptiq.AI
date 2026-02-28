import { Link } from 'react-router-dom';
import { Activity, Users, LayoutDashboard, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <nav className="home-nav" style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 48px', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="sidebar-logo">
                        <Zap size={20} color="white" />
                    </div>
                    <span>ProFlow</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                    <Link to="/register" className="btn btn-primary">Get Started</Link>
                </div>
            </nav>

            <main className="home-hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
                <div className="hero-badge" style={{ background: 'var(--bg-glass)', border: '1px solid var(--accent-purple)', padding: '8px 16px', borderRadius: '100px', fontSize: '14px', color: 'var(--accent-purple)', fontWeight: '600', marginBottom: '24px' }}>
                    Next-Gen Project Management
                </div>
                <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', maxWidth: '800px', lineHeight: '1.2' }}>
                    Manage tasks with <span style={{ background: 'var(--gradient-primary)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>intelligent precision</span>
                </h1>
                <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
                    ProFlow brings your team's work together in one unified workspace. Plan, track, and collaborate on projects effortlessly.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px', borderRadius: 'var(--radius-md)' }}>Start for free</Link>
                    <Link to="/login" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '18px', borderRadius: 'var(--radius-md)' }}>Already a member?</Link>
                </div>

                <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '100px', maxWidth: '1000px', width: '100%' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(124, 58, 237, 0.15)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <LayoutDashboard size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Intuitive Boards</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Visualize your workflow with highly customizable Kanban boards.</p>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <Users size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Team Collaboration</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Keep everyone aligned with real-time updates and seamless communication.</p>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <Activity size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Actionable Insights</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Make data-driven decisions with real-time project analytics.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
