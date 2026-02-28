import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, MoreVertical, Trash2, Edit3, X, Calendar, Users } from 'lucide-react';
import { COLORS } from '../utils/sampleData';

export default function Projects() {
    const { projects, tasks, team, addProject, updateProject, deleteProject, getTeamMember } = useApp();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', color: COLORS[0], deadline: '', members: [] });

    const openCreate = () => { setForm({ name: '', description: '', color: COLORS[0], deadline: '', members: [] }); setEditingProject(null); setShowModal(true); };
    const openEdit = (p) => { setForm({ name: p.name, description: p.description, color: p.color, deadline: p.deadline, members: p.members || [] }); setEditingProject(p.id); setShowModal(true); setMenuOpen(null); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        if (editingProject) { updateProject(editingProject, form); }
        else { addProject(form); }
        setShowModal(false);
    };

    const handleDelete = () => { if (confirmDelete) { deleteProject(confirmDelete); setConfirmDelete(null); } };

    return (
        <div>
            <div className="page-header">
                <div><h1>Projects</h1><p>Manage and track all your projects</p></div>
                <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> New Project</button>
            </div>

            <div className="projects-grid">
                {projects.map(p => {
                    const pTasks = tasks.filter(t => t.projectId === p.id);
                    const done = pTasks.filter(t => t.status === 'done').length;
                    const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                    return (
                        <div className="project-card" key={p.id} onClick={() => navigate(`/board/${p.id}`)} style={{ '--card-color': p.color }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.color }} />
                            <div className="project-card-header">
                                <div className="project-card-title">{p.name}</div>
                                <button className="btn btn-icon btn-secondary" style={{ width: 28, height: 28 }}
                                    onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }}>
                                    <MoreVertical size={16} />
                                </button>
                                {menuOpen === p.id && (
                                    <div style={{ position: 'absolute', right: 16, top: 50, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: 4, zIndex: 10, minWidth: 140 }}
                                        onClick={e => e.stopPropagation()}>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, borderRadius: 4, fontFamily: 'inherit' }}
                                            onClick={() => openEdit(p)}><Edit3 size={14} /> Edit</button>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: 13, borderRadius: 4, fontFamily: 'inherit' }}
                                            onClick={() => { setConfirmDelete(p.id); setMenuOpen(null); }}><Trash2 size={14} /> Delete</button>
                                    </div>
                                )}
                            </div>
                            <div className="project-card-desc">{p.description}</div>
                            <div className="project-progress">
                                <div className="project-progress-bar"><div className="project-progress-fill" style={{ width: `${pct}%`, background: p.color }} /></div>
                                <div className="project-progress-text"><span>{done}/{pTasks.length} tasks</span><span>{pct}%</span></div>
                            </div>
                            <div className="project-card-footer">
                                <div className="project-members">
                                    {(p.members || []).slice(0, 3).map(mid => {
                                        const m = getTeamMember(mid);
                                        return m ? <div key={mid} className="project-member-avatar" style={{ background: m.color }}>{m.avatar}</div> : null;
                                    })}
                                </div>
                                <div className="project-task-count"><Calendar size={12} style={{ marginRight: 4 }} />{p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}</div>
                            </div>
                        </div>
                    );
                })}

                <div className="project-card" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, border: '2px dashed var(--border-color)', background: 'transparent', cursor: 'pointer' }}>
                    <div className="empty-state" style={{ padding: 16 }}>
                        <Plus size={32} style={{ color: 'var(--text-muted)' }} />
                        <h3 style={{ fontSize: 16 }}>Create New Project</h3>
                        <p style={{ fontSize: 13, margin: 0 }}>Start organizing your work</p>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Project Name</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter project name" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What's this project about?" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Deadline</label>
                                        <input className="form-input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Color</label>
                                        <div className="color-picker">
                                            {COLORS.map(c => (
                                                <div key={c} className={`color-option ${form.color === c ? 'selected' : ''}`}
                                                    style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Team Members</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {team.map(m => (
                                            <div key={m.id} onClick={() => {
                                                const members = form.members.includes(m.id) ? form.members.filter(id => id !== m.id) : [...form.members, m.id];
                                                setForm({ ...form, members });
                                            }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                                                    background: form.members.includes(m.id) ? `${m.color}22` : 'var(--bg-glass)',
                                                    border: `1px solid ${form.members.includes(m.id) ? m.color : 'var(--border-color)'}`,
                                                    color: form.members.includes(m.id) ? m.color : 'var(--text-secondary)'
                                                }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{m.avatar}</div>
                                                {m.name.split(' ')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingProject ? 'Save Changes' : 'Create Project'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header"><h2>Delete Project</h2></div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Are you sure you want to delete this project? All associated tasks will also be deleted. This action cannot be undone.
                            </p>
                            <div className="confirm-actions">
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
