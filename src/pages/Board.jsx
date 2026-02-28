import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, GripVertical, Calendar, User } from 'lucide-react';
import TaskDetail from './TaskDetail';

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: '#94a3b8', dotColor: '#94a3b8' },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', dotColor: '#3b82f6' },
    { id: 'review', title: 'In Review', color: '#7c3aed', dotColor: '#7c3aed' },
    { id: 'done', title: 'Done', color: '#10b981', dotColor: '#10b981' },
];

export default function Board() {
    const { projectId } = useParams();
    const { tasks, projects, moveTask, addTask, getTeamMember, team } = useApp();
    const [selectedTask, setSelectedTask] = useState(null);
    const [addingTo, setAddingTo] = useState(null);
    const [newTitle, setNewTitle] = useState('');

    const project = projectId ? projects.find(p => p.id === projectId) : null;
    const filteredTasks = projectId ? tasks.filter(t => t.projectId === projectId) : tasks;

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        moveTask(draggableId, destination.droppableId);
    };

    const handleAddTask = (status) => {
        if (!newTitle.trim()) return;
        addTask({
            title: newTitle.trim(),
            description: '',
            projectId: projectId || projects[0]?.id || '',
            status,
            priority: 'medium',
            assignee: '',
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            subtasks: [],
        });
        setNewTitle('');
        setAddingTo(null);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>{project ? project.name : 'All Tasks'}</h1>
                    <p>{project ? project.description : 'Kanban board view of all tasks'}</p>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board-container">
                    {COLUMNS.map(col => {
                        const colTasks = filteredTasks.filter(t => t.status === col.id);
                        return (
                            <div className="board-column" key={col.id}>
                                <div className="column-header">
                                    <div className="column-title">
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.dotColor }} />
                                        {col.title}
                                        <span className="column-count">{colTasks.length}</span>
                                    </div>
                                </div>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            className="column-tasks"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ background: snapshot.isDraggingOver ? 'rgba(124,58,237,0.05)' : 'transparent', borderRadius: 8, transition: 'background 0.2s' }}
                                        >
                                            {colTasks.map((task, index) => {
                                                const assignee = getTeamMember(task.assignee);
                                                const priorityClass = `badge-${task.priority}`;
                                                const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
                                                return (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(prov, snap) => (
                                                            <div
                                                                className={`task-card ${snap.isDragging ? 'dragging' : ''}`}
                                                                ref={prov.innerRef}
                                                                {...prov.draggableProps}
                                                                {...prov.dragHandleProps}
                                                                onClick={() => setSelectedTask(task.id)}
                                                            >
                                                                <div className="task-card-meta">
                                                                    <span className={`badge ${priorityClass}`}>
                                                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                                    </span>
                                                                    {task.subtasks.length > 0 && (
                                                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                                            {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="task-card-title">{task.title}</div>
                                                                <div className="task-card-footer">
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: daysLeft < 0 ? 'var(--accent-red)' : daysLeft <= 2 ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>
                                                                        <Calendar size={12} />
                                                                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                                                                    </div>
                                                                    {assignee && (
                                                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: assignee.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }} title={assignee.name}>
                                                                            {assignee.avatar}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}

                                            {addingTo === col.id ? (
                                                <div style={{ padding: 4 }}>
                                                    <input
                                                        className="form-input"
                                                        placeholder="Task title..."
                                                        value={newTitle}
                                                        onChange={e => setNewTitle(e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleAddTask(col.id); if (e.key === 'Escape') setAddingTo(null); }}
                                                        autoFocus
                                                        style={{ marginBottom: 8, fontSize: 13 }}
                                                    />
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button className="btn btn-primary btn-sm" onClick={() => handleAddTask(col.id)}>Add</button>
                                                        <button className="btn btn-secondary btn-sm" onClick={() => setAddingTo(null)}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="add-task-btn" onClick={() => { setAddingTo(col.id); setNewTitle(''); }}>
                                                    <Plus size={16} /> Add Task
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {selectedTask && (
                <TaskDetail taskId={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    );
}
