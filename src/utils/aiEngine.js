// AI Engine - Client-side intelligence for project management insights

export function generatePrioritySuggestions(tasks, projects) {
    const suggestions = [];
    const now = new Date();

    tasks.forEach(task => {
        if (task.status === 'done') return;
        const due = new Date(task.dueDate);
        const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0 && task.priority !== 'urgent') {
            suggestions.push({
                type: 'priority-escalation',
                severity: 'critical',
                taskId: task.id,
                title: `Escalate "${task.title}" to Urgent`,
                description: `This task is ${Math.abs(daysLeft)} days overdue and currently marked as ${task.priority}. Consider escalating priority.`,
                color: '#ef4444'
            });
        } else if (daysLeft <= 3 && daysLeft >= 0 && task.priority === 'low') {
            suggestions.push({
                type: 'priority-escalation',
                severity: 'warning',
                taskId: task.id,
                title: `Increase priority of "${task.title}"`,
                description: `Due in ${daysLeft} days but marked as low priority. Consider bumping to medium or high.`,
                color: '#f59e0b'
            });
        }
    });

    return suggestions.slice(0, 5);
}

export function analyzeWorkload(tasks, team) {
    const workload = {};
    team.forEach(m => { workload[m.id] = { member: m, total: 0, active: 0, overdue: 0 }; });
    const now = new Date();

    tasks.forEach(task => {
        if (!task.assignee || task.status === 'done') return;
        if (workload[task.assignee]) {
            workload[task.assignee].total++;
            if (task.status === 'in-progress') workload[task.assignee].active++;
            if (new Date(task.dueDate) < now) workload[task.assignee].overdue++;
        }
    });

    const entries = Object.values(workload);
    const avg = entries.reduce((s, e) => s + e.total, 0) / entries.length || 1;
    const suggestions = [];

    entries.forEach(e => {
        if (e.total > avg * 1.5 && e.total >= 3) {
            suggestions.push({
                type: 'workload-high',
                title: `${e.member.name} is overloaded`,
                description: `Has ${e.total} tasks (avg: ${Math.round(avg)}). Consider redistributing some tasks.`,
                color: '#ef4444',
                memberId: e.member.id
            });
        }
        if (e.total === 0) {
            suggestions.push({
                type: 'workload-low',
                title: `${e.member.name} has no tasks`,
                description: `Available for new assignments. Consider assigning some tasks from overloaded members.`,
                color: '#10b981',
                memberId: e.member.id
            });
        }
    });

    return { workload: entries, suggestions: suggestions.slice(0, 4) };
}

export function detectRisks(tasks, projects) {
    const risks = [];
    const now = new Date();

    // Overdue tasks
    const overdue = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < now);
    if (overdue.length > 0) {
        risks.push({
            title: `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`,
            description: `Tasks past their deadline need immediate attention.`,
            score: Math.min(10, overdue.length * 2 + 3),
            color: '#ef4444'
        });
    }

    // Projects with no progress
    projects.forEach(p => {
        const projectTasks = tasks.filter(t => t.projectId === p.id);
        const done = projectTasks.filter(t => t.status === 'done').length;
        const total = projectTasks.length;
        if (total > 2 && done === 0) {
            risks.push({
                title: `"${p.name}" has no completed tasks`,
                description: `${total} tasks created but none completed. May be blocked or deprioritized.`,
                score: 6,
                color: '#f59e0b'
            });
        }
    });

    // Too many urgent tasks
    const urgent = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
    if (urgent.length >= 3) {
        risks.push({
            title: `${urgent.length} urgent tasks active`,
            description: `High number of urgent tasks may indicate scope issues or poor prioritization.`,
            score: 7,
            color: '#f97316'
        });
    }

    // Unassigned tasks
    const unassigned = tasks.filter(t => !t.assignee && t.status !== 'done');
    if (unassigned.length > 0) {
        risks.push({
            title: `${unassigned.length} unassigned task${unassigned.length > 1 ? 's' : ''}`,
            description: `Tasks without owners risk being forgotten. Assign them to team members.`,
            score: 4,
            color: '#06b6d4'
        });
    }

    return risks.sort((a, b) => b.score - a.score).slice(0, 5);
}

export function generateSmartSuggestions(tasks, projects, team) {
    const suggestions = [];
    const now = new Date();
    const activeTasks = tasks.filter(t => t.status !== 'done');

    // Suggest breaking down large tasks
    activeTasks.forEach(t => {
        if (t.subtasks.length === 0 && t.priority !== 'low') {
            suggestions.push({
                title: `Break down "${t.title}"`,
                description: `This task has no subtasks. Breaking it into smaller pieces improves tracking and completion rate.`,
                icon: 'split',
                color: '#3b82f6'
            });
        }
    });

    // Suggest task review
    const inReview = tasks.filter(t => t.status === 'review');
    if (inReview.length >= 2) {
        suggestions.push({
            title: `Review bottleneck detected`,
            description: `${inReview.length} tasks waiting for review. Schedule a review session to unblock progress.`,
            icon: 'eye',
            color: '#7c3aed'
        });
    }

    // Sprint planning suggestion
    const todoTasks = tasks.filter(t => t.status === 'todo');
    if (todoTasks.length > 5) {
        suggestions.push({
            title: `Prioritize your backlog`,
            description: `${todoTasks.length} tasks in Todo. Consider a planning session to prioritize and assign.`,
            icon: 'list',
            color: '#06b6d4'
        });
    }

    // Deadline clustering
    const upcomingDates = {};
    activeTasks.forEach(t => {
        const key = t.dueDate;
        if (!upcomingDates[key]) upcomingDates[key] = [];
        upcomingDates[key].push(t);
    });
    Object.entries(upcomingDates).forEach(([date, dateTasks]) => {
        if (dateTasks.length >= 3) {
            suggestions.push({
                title: `Deadline clustering on ${new Date(date).toLocaleDateString()}`,
                description: `${dateTasks.length} tasks due on the same day. Consider staggering deadlines to avoid crunch.`,
                icon: 'calendar',
                color: '#f59e0b'
            });
        }
    });

    return suggestions.slice(0, 6);
}

export function getProductivityScore(tasks) {
    const total = tasks.length;
    if (total === 0) return { score: 0, label: 'No Data', color: '#64748b' };
    const done = tasks.filter(t => t.status === 'done').length;
    const now = new Date();
    const overdue = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < now).length;

    let score = Math.round((done / total) * 100);
    score -= overdue * 5;
    score = Math.max(0, Math.min(100, score));

    let label, color;
    if (score >= 80) { label = 'Excellent'; color = '#10b981'; }
    else if (score >= 60) { label = 'Good'; color = '#3b82f6'; }
    else if (score >= 40) { label = 'Average'; color = '#f59e0b'; }
    else { label = 'Needs Improvement'; color = '#ef4444'; }

    return { score, label, color };
}
