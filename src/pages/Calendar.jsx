import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
    const { tasks, projects } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const prev = () => setCurrentDate(new Date(year, month - 1, 1));
    const next = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const cells = [];
    // Prev month
    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ day: daysInPrev - i, month: month - 1, otherMonth: true });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        cells.push({ day: i, month, otherMonth: false });
    }
    // Next month
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
        cells.push({ day: i, month: month + 1, otherMonth: true });
    }

    const getTasksForDay = (day, m) => {
        const y = m < 0 ? year - 1 : m > 11 ? year + 1 : year;
        const actualMonth = ((m % 12) + 12) % 12;
        return tasks.filter(t => {
            const d = new Date(t.dueDate);
            return d.getFullYear() === y && d.getMonth() === actualMonth && d.getDate() === day;
        });
    };

    const isToday = (day, m) => {
        return !cells.find(c => c.day === day && c.month === m)?.otherMonth &&
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const statusColors = { 'todo': '#94a3b8', 'in-progress': '#3b82f6', 'review': '#7c3aed', 'done': '#10b981' };

    return (
        <div>
            <div className="page-header">
                <div><h1>Calendar</h1><p>View tasks by their due dates</p></div>
                <button className="btn btn-secondary" onClick={goToday}>Today</button>
            </div>

            <div className="calendar-container">
                <div className="calendar-header">
                    <h2>{MONTHS[month]} {year}</h2>
                    <div className="calendar-nav">
                        <button className="btn btn-icon btn-secondary" onClick={prev}><ChevronLeft size={18} /></button>
                        <button className="btn btn-icon btn-secondary" onClick={next}><ChevronRight size={18} /></button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {DAYS.map(d => <div className="calendar-day-header" key={d}>{d}</div>)}
                    {cells.map((cell, i) => {
                        const dayTasks = getTasksForDay(cell.day, cell.month);
                        const todayClass = isToday(cell.day, cell.month) ? 'today' : '';
                        return (
                            <div className={`calendar-day ${cell.otherMonth ? 'other-month' : ''} ${todayClass}`} key={i}>
                                <div className="calendar-date">{cell.day}</div>
                                {dayTasks.slice(0, 3).map(t => {
                                    const proj = projects.find(p => p.id === t.projectId);
                                    return (
                                        <div key={t.id} className="calendar-task"
                                            style={{ background: `${statusColors[t.status]}22`, color: statusColors[t.status], fontSize: 11 }}
                                            title={`${t.title} (${t.status})`}>
                                            {t.title}
                                        </div>
                                    );
                                })}
                                {dayTasks.length > 3 && (
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>+{dayTasks.length - 3} more</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
