import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
    LayoutDashboard, FolderKanban, LayoutGrid, CalendarDays,
    Users, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
    const { sidebarCollapsed, setSidebarCollapsed, projects, tasks, user } = useApp();
    const activeTasks = tasks.filter(t => t.status !== 'done').length;

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/projects', icon: FolderKanban, label: 'Projects', badge: projects.length },
        { path: '/board', icon: LayoutGrid, label: 'Board', badge: activeTasks },
        { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
        { path: '/team', icon: Users, label: 'Team' },
        { path: '/ai', icon: Sparkles, label: 'AI Insights' },
    ];

    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">P</div>
                {!sidebarCollapsed && (
                    <div className="sidebar-brand"><span>ProFlow</span></div>
                )}
            </div>

            <button
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!sidebarCollapsed && <div className="nav-section-title">Main Menu</div>}
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end={item.path === '/'}
                            title={sidebarCollapsed ? item.label : undefined}
                            onClick={onCloseMobile}
                        >
                            <item.icon size={20} />
                            {!sidebarCollapsed && (
                                <>
                                    <span>{item.label}</span>
                                    {item.badge != null && <span className="nav-badge">{item.badge}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {!sidebarCollapsed && projects.length > 0 && (
                    <div className="nav-section">
                        <div className="nav-section-title">Projects</div>
                        {projects.slice(0, 4).map(p => (
                            <NavLink
                                key={p.id}
                                to={`/board/${p.id}`}
                                className="nav-item"
                                style={{ fontSize: '13px' }}
                                onClick={onCloseMobile}
                            >
                                <div style={{
                                    width: 10, height: 10, borderRadius: 3,
                                    background: p.color, flexShrink: 0
                                }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-avatar" style={{ background: user?.color || 'var(--gradient-warm)' }}>{user?.avatar || 'AM'}</div>
                {!sidebarCollapsed && (
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'Alex Morgan'}</div>
                        <div className="sidebar-user-role">{user?.role || 'Project Manager'}</div>
                    </div>
                )}
            </div>
        </aside>
    );
}
