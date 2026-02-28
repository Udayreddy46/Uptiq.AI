import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sparkles, Menu, X, CheckCircle2, AlertTriangle, Clock, FolderKanban, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projects',
    '/board': 'Board',
    '/calendar': 'Calendar',
    '/team': 'Team',
    '/ai': 'AI Insights',
};

export default function Topbar({ onMenuToggle }) {
    const { sidebarCollapsed, tasks, projects, team, activity, getTeamMember, logout } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const searchRef = useRef(null);
    const notifRef = useRef(null);

    const pathKey = '/' + location.pathname.split('/')[1];
    const title = pageTitles[pathKey] || 'ProFlow';

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Search results
    const searchResults = searchQuery.trim().length > 0 ? {
        tasks: tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),
        projects: projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
        members: team.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    } : null;

    const hasResults = searchResults && (searchResults.tasks.length + searchResults.projects.length + searchResults.members.length) > 0;

    const handleSearchSelect = (type, item) => {
        setSearchQuery('');
        setShowSearch(false);
        if (type === 'task') navigate('/board');
        else if (type === 'project') navigate(`/board/${item.id}`);
        else if (type === 'member') navigate('/team');
    };

    // Notifications from activity
    const notifications = activity.slice(0, 8).map((a, i) => {
        const member = getTeamMember(a.user);
        return { ...a, memberName: member?.name || 'Unknown', memberAvatar: member?.avatar || '?', memberColor: member?.color || '#7c3aed' };
    });

    const priorityColors = { urgent: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981' };
    const statusIcons = { todo: Clock, 'in-progress': Clock, review: AlertTriangle, done: CheckCircle2 };

    return (
        <header className={`topbar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="topbar-left">
                <button className="topbar-btn mobile-menu-btn" onClick={onMenuToggle} id="mobile-menu-btn">
                    <Menu size={20} />
                </button>
                <h1 className="topbar-title">{title}</h1>
            </div>

            {/* Search with dropdown */}
            <div className="topbar-search-wrapper" ref={searchRef}>
                <div className="topbar-search" onClick={() => setShowSearch(true)}>
                    <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search projects, tasks, team..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
                        onFocus={() => setShowSearch(true)}
                    />
                    {searchQuery && (
                        <button onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                {showSearch && searchResults && (
                    <div className="search-dropdown">
                        {!hasResults ? (
                            <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No results found for "{searchQuery}"</div>
                        ) : (
                            <>
                                {searchResults.projects.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-title">Projects</div>
                                        {searchResults.projects.map(p => (
                                            <div key={p.id} className="search-item" onClick={() => handleSearchSelect('project', p)}>
                                                <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                                                <span>{p.name}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{tasks.filter(t => t.projectId === p.id).length} tasks</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchResults.tasks.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-title">Tasks</div>
                                        {searchResults.tasks.map(t => (
                                            <div key={t.id} className="search-item" onClick={() => handleSearchSelect('task', t)}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColors[t.priority] || '#94a3b8', flexShrink: 0 }} />
                                                <span>{t.title}</span>
                                                <span className={`badge badge-${t.status === 'in-progress' ? 'progress' : t.status}`} style={{ marginLeft: 'auto', fontSize: 10 }}>
                                                    {t.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchResults.members.length > 0 && (
                                    <div className="search-section">
                                        <div className="search-section-title">Team</div>
                                        {searchResults.members.map(m => (
                                            <div key={m.id} className="search-item" onClick={() => handleSearchSelect('member', m)}>
                                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{m.avatar}</div>
                                                <span>{m.name}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="topbar-right">
                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button className="topbar-btn" title="Notifications" onClick={() => setShowNotifs(!showNotifs)}>
                        <Bell size={20} />
                        <span className="notif-dot"></span>
                    </button>
                    {showNotifs && (
                        <div className="notif-dropdown">
                            <div className="notif-header">
                                <strong>Notifications</strong>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{notifications.length} new</span>
                            </div>
                            {notifications.map((n, i) => (
                                <div key={n.id || i} className="notif-item">
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: n.memberColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                                        {n.memberAvatar}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                                            <strong>{n.memberName}</strong> {n.action} <strong>{n.target}</strong>
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="topbar-btn ai-btn" onClick={() => navigate('/ai')} title="AI Insights">
                    <Sparkles size={16} />
                    <span>AI</span>
                </button>
                <button className="topbar-btn" onClick={() => { logout(); navigate('/login'); }} title="Logout">
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
