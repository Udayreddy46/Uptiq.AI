export const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#f97316'];

export const sampleTeam = [
    { id: 't1', name: 'Alex Morgan', role: 'Project Manager', avatar: 'AM', color: '#7c3aed' },
    { id: 't2', name: 'Sarah Chen', role: 'Lead Developer', avatar: 'SC', color: '#3b82f6' },
    { id: 't3', name: 'James Wilson', role: 'UI/UX Designer', avatar: 'JW', color: '#06b6d4' },
    { id: 't4', name: 'Maya Patel', role: 'Backend Dev', avatar: 'MP', color: '#10b981' },
    { id: 't5', name: 'Ryan Kim', role: 'QA Engineer', avatar: 'RK', color: '#f59e0b' },
    { id: 't6', name: 'Emma Davis', role: 'DevOps', avatar: 'ED', color: '#ec4899' },
];

const statusOptions = ['todo', 'in-progress', 'review', 'done'];
const priorityOptions = ['low', 'medium', 'high', 'urgent'];
const taskTitles = [
    'Design homepage mockup', 'Set up CI/CD pipeline', 'Implement responsive nav', 'User authentication flow',
    'API rate limiting', 'Design system components', 'Performance optimization', 'Write API documentation',
    'Setup analytics tracking', 'Unit test coverage', 'Database migration', 'Build chart widgets',
    'Push notification system', 'Security audit', 'Create onboarding flow', 'Fix memory leak',
    'Update dependency packages', 'Add dark mode toggle', 'Configure Webpack', 'Refactor state management'
];
const actions = ['completed', 'moved', 'created', 'commented on', 'assigned', 'updated priority of'];

// Generate 1000 Projects
export const sampleProjects = Array.from({ length: 1000 }).map((_, index) => {
    const id = `p${index + 1}`;

    // Distribute among colors
    const color = COLORS[index % COLORS.length];

    // Dates
    const now = Date.now();
    const createdAgo = Math.random() * 60 * 24 * 60 * 60 * 1000; // up to 60 days ago
    const deadlineFuture = Math.random() * 60 * 24 * 60 * 60 * 1000; // up to 60 days in future

    return {
        id,
        name: `Project Alpha ${index + 1}`,
        description: `This is an auto-generated description for project ${index + 1}.`,
        color,
        deadline: new Date(now + deadlineFuture).toISOString().split('T')[0],
        createdAt: new Date(now - createdAgo).toISOString().split('T')[0],
        members: sampleTeam.slice(0, Math.floor(Math.random() * 4) + 1).map(m => m.id)
    };
});

// Generate 5000 Tasks
export const sampleTasks = Array.from({ length: 5000 }).map((_, index) => {
    const id = `tk${index + 1}`;

    const project = sampleProjects[Math.floor(Math.random() * sampleProjects.length)];
    const titleBase = taskTitles[index % taskTitles.length];

    const now = Date.now();
    const createdAgo = Math.random() * 30 * 24 * 60 * 60 * 1000;
    const dueOffset = (Math.random() * 40 - 10) * 24 * 60 * 60 * 1000; // between 10 days ago and 30 days future

    return {
        id,
        title: `${titleBase} - ${index + 1}`,
        description: `Detailed requirements and steps for completing task ${index + 1}.`,
        projectId: project.id,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        priority: priorityOptions[Math.floor(Math.random() * priorityOptions.length)],
        assignee: `t${Math.floor(Math.random() * 6) + 1}`,
        dueDate: new Date(now + dueOffset).toISOString().split('T')[0],
        createdAt: new Date(now - createdAgo).toISOString().split('T')[0],
        subtasks: Array.from({ length: Math.floor(Math.random() * 4) }).map((_, j) => ({
            id: `s${id}_${j}`,
            text: `Subtask ${j + 1} for ${titleBase}`,
            done: Math.random() > 0.5
        }))
    };
});

// Generate 5000 Activities
export const sampleActivity = Array.from({ length: 5000 }).map((_, index) => {
    const id = `a${index + 1}`;

    const task = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
    const project = sampleProjects.find(p => p.id === task.projectId);

    const timeOffsetMs = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days ago

    let timeStr = '';
    if (timeOffsetMs < 3600000) {
        const mins = Math.max(1, Math.floor(timeOffsetMs / 60000));
        timeStr = `${mins} minute${mins === 1 ? '' : 's'} ago`;
    } else if (timeOffsetMs < 86400000) {
        const hours = Math.max(1, Math.floor(timeOffsetMs / 3600000));
        timeStr = `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
        const days = Math.max(1, Math.floor(timeOffsetMs / 86400000));
        timeStr = `${days} day${days === 1 ? '' : 's'} ago`;
    }

    const action = actions[Math.floor(Math.random() * actions.length)];
    let detail = '';
    if (action === 'moved') detail = `to ${statusOptions[Math.floor(Math.random() * statusOptions.length)]}`;
    if (action === 'assigned') detail = 'to themselves';
    if (action === 'updated priority of') detail = `to ${priorityOptions[Math.floor(Math.random() * priorityOptions.length)]}`;

    return {
        id,
        user: `t${Math.floor(Math.random() * 6) + 1}`,
        action,
        target: task.title,
        detail,
        project: project?.name || 'Unknown Project',
        time: timeStr,
        timestamp: Date.now() - timeOffsetMs
    };
}).sort((a, b) => b.timestamp - a.timestamp); // Sort from newest to oldest
