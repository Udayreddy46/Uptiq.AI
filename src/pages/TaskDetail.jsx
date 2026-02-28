import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Check, Plus } from 'lucide-react';

export default function TaskDetail({ taskId, onClose }) {
    const { tasks, projects, team, updateTask, deleteTask } = useApp();
    const task = tasks.find(t => t.id === taskId);
    const [newSubtask, setNewSubtask] = useState('');
    const [confirmDel, setConfirmDel] = useState(false);

    if (!task) return null;

    const project = projects.find(p => p.id === task.projectId);

    const update = (field, value) => updateTask(taskId, { [field]: value });

    const toggleSubtask = (sid) => {
        const subs = task.subtasks.map(s => s.id === sid ? { ...s, done: !s.done } : s);
        updateTask(taskId, { subtasks: subs });
    };

    const addSubtask = () => {
        if (!newSubtask.trim()) return;
        const subs = [...task.subtasks, { id: 'sub' + Date.now(), text: newSubtask.trim(), done: false }];
        updateTask(taskId, { subtasks: subs });
        setNewSubtask('');
    };

    const removeSubtask = (sid) => {
        updateTask(taskId, { subtasks: task.subtasks.filter(s => s.id !== sid) });
    };

    const handleDelete = () => { deleteTask(taskId); onClose(); };

    return (
        <>
            <div className="slideOver-overlay" onClick={onClose} />
            <div className="slideOver">
                <div className="slideOver-header">
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Task Details</h2>
                    <button className="modal-close" onClick={onClose}><X size={18} /></button>
                </div>
                <div className="slideOver-body">
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input className="form-input" value={task.title} onChange={e => update('title', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" value={task.description} onChange={e => update('description', e.target.value)} placeholder="Add a description..." />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={task.status} onChange={e => update('status', e.target.value)}>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">In Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select className="form-select" value={task.priority} onChange={e => update('priority', e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Assignee</label>
                            <select className="form-select" value={task.assignee} onChange={e => update('assignee', e.target.value)}>
                                <option value="">Unassigned</option>
                                {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input className="form-input" type="date" value={task.dueDate} onChange={e => update('dueDate', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Project</label>
                        <select className="form-select" value={task.projectId} onChange={e => update('projectId', e.target.value)}>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subtasks ({task.subtasks.filter(s => s.done).length}/{task.subtasks.length})</label>
                        {task.subtasks.map(sub => (
                            <div className="subtask-item" key={sub.id}>
                                <button className={`subtask-checkbox ${sub.done ? 'checked' : ''}`} onClick={() => toggleSubtask(sub.id)}>
                                    {sub.done && <Check size={12} />}
                                </button>
                                <span className={`subtask-text ${sub.done ? 'done' : ''}`}>{sub.text}</span>
                                <button onClick={() => removeSubtask(sub.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <div className="add-subtask">
                            <input className="form-input" placeholder="Add subtask..." value={newSubtask}
                                onChange={e => setNewSubtask(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') addSubtask(); }}
                                style={{ fontSize: 13 }}
                            />
                            <button className="btn btn-primary btn-sm" onClick={addSubtask}><Plus size={14} /></button>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 12 }}>
                        {!confirmDel ? (
                            <button className="btn btn-danger" onClick={() => setConfirmDel(true)}><Trash2 size={16} /> Delete Task</button>
                        ) : (
                            <>
                                <button className="btn btn-danger" onClick={handleDelete}>Confirm Delete</button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDel(false)}>Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
