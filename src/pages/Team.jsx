import { useApp } from '../context/AppContext';

export default function Team() {
    const { team, tasks } = useApp();

    return (
        <div>
            <div className="page-header">
                <div><h1>Team</h1><p>Manage your team and track workloads</p></div>
            </div>

            <div className="team-grid">
                {team.map(member => {
                    const memberTasks = tasks.filter(t => t.assignee === member.id);
                    const done = memberTasks.filter(t => t.status === 'done').length;
                    const active = memberTasks.filter(t => t.status === 'in-progress').length;
                    const total = memberTasks.length;
                    const workloadPct = Math.min(100, (total / 5) * 100);
                    const wColor = workloadPct > 80 ? '#ef4444' : workloadPct > 50 ? '#f59e0b' : '#10b981';

                    return (
                        <div className="team-card" key={member.id}>
                            <div className="team-avatar" style={{ background: member.color }}>{member.avatar}</div>
                            <div className="team-name">{member.name}</div>
                            <div className="team-role">{member.role}</div>
                            <div className="team-stats">
                                <div><div className="team-stat-value">{total}</div><div className="team-stat-label">Total</div></div>
                                <div><div className="team-stat-value" style={{ color: '#3b82f6' }}>{active}</div><div className="team-stat-label">Active</div></div>
                                <div><div className="team-stat-value" style={{ color: '#10b981' }}>{done}</div><div className="team-stat-label">Done</div></div>
                            </div>
                            <div className="team-workload">
                                <div className="team-workload-bar">
                                    <div className="team-workload-fill" style={{ width: `${workloadPct}%`, background: wColor }} />
                                </div>
                                <div className="team-workload-text" style={{ color: wColor }}>{Math.round(workloadPct)}% workload</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
