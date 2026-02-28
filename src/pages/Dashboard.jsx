import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FolderKanban, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard() {
    const { projects, tasks, team, activity, getTeamMember } = useApp();
    const navigate = useNavigate();

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => {
        if (t.status === 'done') return false;
        return new Date(t.dueDate) < new Date();
    }).length;

    const statusCounts = {
        'todo': tasks.filter(t => t.status === 'todo').length,
        'in-progress': inProgress,
        'review': tasks.filter(t => t.status === 'review').length,
        'done': doneTasks,
    };
    const maxCount = Math.max(...Object.values(statusCounts), 1);

    const upcoming = tasks
        .filter(t => t.status !== 'done' && new Date(t.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Alex! Here's your project overview.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card" onClick={() => navigate('/projects')} title="View all projects">
                    <div className="stat-icon"><FolderKanban size={24} /></div>
                    <div className="stat-value">{projects.length}</div>
                    <div className="stat-label">Total Projects</div>
                    <div className="stat-change up"><TrendingUp size={14} /> Active</div>
                </div>
                <div className="stat-card" onClick={() => navigate('/board')} title="View completed tasks">
                    <div className="stat-icon"><CheckCircle2 size={24} /></div>
                    <div className="stat-value">{doneTasks}</div>
                    <div className="stat-label">Completed Tasks</div>
                    <div className="stat-change up"><ArrowUpRight size={14} /> {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%</div>
                </div>
                <div className="stat-card" onClick={() => navigate('/board')} title="View in-progress tasks">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-value">{inProgress}</div>
                    <div className="stat-label">In Progress</div>
                    <div className="stat-change up"><ArrowUpRight size={14} /> Active</div>
                </div>
                <div className="stat-card" onClick={() => navigate('/board')} title="View overdue tasks">
                    <div className="stat-icon"><AlertTriangle size={24} /></div>
                    <div className="stat-value">{overdue}</div>
                    <div className="stat-label">Overdue</div>
                    <div className="stat-change down"><ArrowDownRight size={14} /> Attention needed</div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Task Distribution</h3>
                    <div className="chart-bar-group">
                        {Object.entries(statusCounts).map(([status, count]) => {
                            const colors = { 'todo': '#94a3b8', 'in-progress': '#3b82f6', 'review': '#7c3aed', 'done': '#10b981' };
                            const labels = { 'todo': 'To Do', 'in-progress': 'Active', 'review': 'Review', 'done': 'Done' };
                            return (
                                <div className="chart-bar-wrapper" key={status}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: colors[status] }}>{count}</div>
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${(count / maxCount) * 100}%`, background: colors[status] }}
                                        title={`${labels[status]}: ${count}`}
                                        onClick={() => navigate('/board')}
                                    />
                                    <div className="chart-label">{labels[status]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Upcoming Deadlines</h3>
                    {upcoming.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No upcoming tasks 🎉</p>
                    ) : (
                        upcoming.map(task => {
                            const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                            const member = getTeamMember(task.assignee);
                            return (
                                <div
                                    key={task.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                                    onClick={() => navigate('/board')}
                                >
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                        background: task.priority === 'urgent' ? '#ef4444' : task.priority === 'high' ? '#f97316' : '#3b82f6'
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member?.name || 'Unassigned'}</div>
                                    </div>
                                    <div style={{
                                        fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                                        color: daysLeft <= 2 ? '#ef4444' : daysLeft <= 5 ? '#f59e0b' : 'var(--text-secondary)'
                                    }}>
                                        {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d left`}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="dashboard-grid-equal">
                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
                    {activity.slice(0, 6).map(item => {
                        const member = getTeamMember(item.user);
                        return (
                            <div className="activity-item" key={item.id}>
                                <div className="activity-avatar" style={{ background: member?.color || '#7c3aed' }}>
                                    {member?.avatar || '?'}
                                </div>
                                <div>
                                    <div className="activity-text">
                                        <strong>{member?.name || 'Unknown'}</strong> {item.action} <strong>{item.target}</strong>
                                        {item.detail && ` ${item.detail}`}
                                    </div>
                                    <div className="activity-time">{item.time}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Project Progress</h3>
                    {projects.map(p => {
                        const pTasks = tasks.filter(t => t.projectId === p.id);
                        const pDone = pTasks.filter(t => t.status === 'done').length;
                        const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
                        return (
                            <div key={p.id} style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => navigate(`/board/${p.id}`)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                                </div>
                                <div className="project-progress-bar">
                                    <div className="project-progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
