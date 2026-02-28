import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sampleProjects, sampleTasks, sampleTeam, sampleActivity } from '../utils/sampleData';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const STORAGE_KEY = 'proflow_data';

function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            // Temporary measure: Ignore old stored data if it has less than 1000 projects
            if (data.projects && data.projects.length < 1000) {
                console.log('Clearing old sample data to load 1000 projects');
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return data;
        }
    } catch (e) { console.error('Failed to load data:', e); }
    return null;
}

function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.error('Failed to save data:', e); }
}

export function AppProvider({ children }) {
    const stored = loadData();
    const [projects, setProjects] = useState(stored?.projects || sampleProjects);
    const [tasks, setTasks] = useState(stored?.tasks || sampleTasks);
    const [team] = useState(stored?.team || sampleTeam);
    const [activity, setActivity] = useState(stored?.activity || sampleActivity);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [user, setUser] = useState(stored?.user || null);

    useEffect(() => {
        saveData({ projects, tasks, team, activity, user });
    }, [projects, tasks, team, activity, user]);

    const addProject = useCallback((project) => {
        const newProject = { ...project, id: 'p' + Date.now(), createdAt: new Date().toISOString().split('T')[0] };
        setProjects(prev => [...prev, newProject]);
        addActivity('created project', newProject.name, '');
        return newProject;
    }, []);

    const updateProject = useCallback((id, updates) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteProject = useCallback((id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        setTasks(prev => prev.filter(t => t.projectId !== id));
    }, []);

    const addTask = useCallback((task) => {
        const newTask = {
            ...task, id: 'tk' + Date.now(), subtasks: task.subtasks || [],
            createdAt: new Date().toISOString().split('T')[0]
        };
        setTasks(prev => [...prev, newTask]);
        addActivity('created task', newTask.title, '');
        return newTask;
    }, []);

    const updateTask = useCallback((id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    const moveTask = useCallback((taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }, []);

    const addActivity = useCallback((action, target, detail) => {
        const entry = { id: 'a' + Date.now(), user: 't1', action, target, detail, time: 'Just now' };
        setActivity(prev => [entry, ...prev].slice(0, 20));
    }, []);

    const getProjectTasks = useCallback((projectId) => {
        return tasks.filter(t => t.projectId === projectId);
    }, [tasks]);

    const getTeamMember = useCallback((id) => {
        return team.find(m => m.id === id);
    }, [team]);

    const login = useCallback((userData) => {
        if (!userData) {
            // Default login as Project Manager
            const pm = team.find(m => m.role === 'Project Manager');
            setUser(pm || team[0]);
        } else {
            setUser(userData);
        }
    }, [team]);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = {
        projects, tasks, team, activity, user,
        sidebarCollapsed, setSidebarCollapsed,
        selectedProject, setSelectedProject,
        addProject, updateProject, deleteProject,
        addTask, updateTask, deleteTask, moveTask,
        getProjectTasks, getTeamMember, addActivity,
        login, logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
