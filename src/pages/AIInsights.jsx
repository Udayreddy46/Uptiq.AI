import { useApp } from '../context/AppContext';
import { generatePrioritySuggestions, analyzeWorkload, detectRisks, generateSmartSuggestions, getProductivityScore } from '../utils/aiEngine';
import { Sparkles, AlertTriangle, BarChart3, Lightbulb, Shield, TrendingUp } from 'lucide-react';

export default function AIInsights() {
    const { tasks, projects, team } = useApp();

    const prioritySuggestions = generatePrioritySuggestions(tasks, projects);
    const { workload, suggestions: workloadSuggestions } = analyzeWorkload(tasks, team);
    const risks = detectRisks(tasks, projects);
    const smartSuggestions = generateSmartSuggestions(tasks, projects, team);
    const productivity = getProductivityScore(tasks);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Sparkles size={28} style={{ color: 'var(--accent-purple)' }} /> AI Insights
                    </h1>
                    <p>Intelligent analysis and recommendations for your projects</p>
                </div>
            </div>

            {/* Productivity Score Banner */}
            <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: 80, height: 80 }}>
                        <svg viewBox="0 0 36 36" style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke={productivity.color} strokeWidth="3"
                                strokeDasharray={`${productivity.score}, 100`} strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: productivity.color }}>
                            {productivity.score}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Productivity Score</div>
                        <div style={{ fontSize: 14, color: productivity.color, fontWeight: 600 }}>{productivity.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                            Based on completion rate and overdue tasks analysis
                        </div>
                    </div>
                </div>
            </div>

            <div className="ai-container">
                {/* Smart Suggestions */}
                <div className="ai-card">
                    <div className="ai-card-header">
                        <div className="ai-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}><Lightbulb size={20} /></div>
                        <div><div className="ai-card-title">Smart Suggestions</div><div className="ai-card-subtitle">AI-powered recommendations</div></div>
                    </div>
                    <div className="ai-card-body">
                        {smartSuggestions.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Everything looks great! No suggestions right now.</p>
                        ) : smartSuggestions.map((s, i) => (
                            <div className="ai-suggestion" key={i}>
                                <div className="ai-dot" style={{ background: s.color }} />
                                <div className="ai-suggestion-text"><strong>{s.title}</strong>{s.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority Analysis */}
                <div className="ai-card">
                    <div className="ai-card-header">
                        <div className="ai-card-icon" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}><TrendingUp size={20} /></div>
                        <div><div className="ai-card-title">Priority Analysis</div><div className="ai-card-subtitle">Suggested priority adjustments</div></div>
                    </div>
                    <div className="ai-card-body">
                        {prioritySuggestions.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>All task priorities look appropriate!</p>
                        ) : prioritySuggestions.map((s, i) => (
                            <div className="ai-suggestion" key={i}>
                                <div className="ai-dot" style={{ background: s.color }} />
                                <div className="ai-suggestion-text"><strong>{s.title}</strong>{s.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Detection */}
                <div className="ai-card">
                    <div className="ai-card-header">
                        <div className="ai-card-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}><AlertTriangle size={20} /></div>
                        <div><div className="ai-card-title">Risk Detection</div><div className="ai-card-subtitle">Potential bottlenecks & issues</div></div>
                    </div>
                    <div className="ai-card-body">
                        {risks.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No risks detected. Keep up the great work!</p>
                        ) : risks.map((r, i) => (
                            <div className="ai-risk-item" key={i}>
                                <div className="ai-risk-score" style={{ background: `${r.color}22`, color: r.color }}>{r.score}</div>
                                <div><div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.description}</div></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workload Analysis */}
                <div className="ai-card">
                    <div className="ai-card-header">
                        <div className="ai-card-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><BarChart3 size={20} /></div>
                        <div><div className="ai-card-title">Workload Balance</div><div className="ai-card-subtitle">Team capacity analysis</div></div>
                    </div>
                    <div className="ai-card-body">
                        {workload.map((w, i) => {
                            const pct = Math.min(100, (w.total / 5) * 100);
                            const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981';
                            return (
                                <div key={i} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{w.member.name}</span>
                                        <span style={{ fontSize: 12, color }}>{w.total} tasks</span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                        {workloadSuggestions.length > 0 && (
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                {workloadSuggestions.map((s, i) => (
                                    <div className="ai-suggestion" key={i}>
                                        <div className="ai-dot" style={{ background: s.color }} />
                                        <div className="ai-suggestion-text"><strong>{s.title}</strong>{s.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
