import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // User wants default google button to log in as Project Manager
    const handleGoogleLogin = () => {
        login(); // Uses context default login (project manager)
        navigate('/dashboard');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Just mocking standard login for completeness, defaulting to PM if no args matched
        login();
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <div className="sidebar-logo" style={{ width: '48px', height: '48px', marginBottom: '24px' }}>
                    <Zap size={24} color="white" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Welcome back</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>Enter your details to access your account.</p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '15px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                            <a href="#" style={{ fontSize: '13px', color: 'var(--accent-purple)', textDecoration: 'none' }}>Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '15px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '16px', marginTop: '8px' }}>
                        Sign in
                    </button>
                </form>

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <button onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <p style={{ marginTop: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
