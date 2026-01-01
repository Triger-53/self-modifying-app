import React, { useState, useEffect, useCallback } from 'react';
import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { bundle } from './utils/bundler';
import ProjectDashboard from './ProjectDashboard';

// Expose React globally for the bundled code to find
window.React = ReactModule;
window.ReactDOM = ReactDOMModule;

function ReferenceAppModal({ isOpen, onClose, referenceData, onSave }) {
  const [url, setUrl] = useState(referenceData.url || '');
  const [description, setDescription] = useState(referenceData.description || '');

  useEffect(() => {
    if (isOpen) {
      setUrl(referenceData.url || '');
      setDescription(referenceData.description || '');
    }
  }, [isOpen, referenceData]);

  const handleSave = () => {
    onSave({ url, description });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ background: '#1a1f35', color: 'white', border: '1px solid rgba(102, 126, 234, 0.3)', maxWidth: '500px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Reference App</h2>
        <p style={{ color: '#b8c5d6', fontSize: '0.9rem', marginBottom: '20px' }}>
          Provide details about an existing app you'd like the AI to use as a reference.
        </p>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ color: '#b8c5d6', display: 'block', marginBottom: '8px', fontWeight: 600 }}>App URL (optional)</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
          />
        </div>

        <div className="form-group">
          <label style={{ color: '#b8c5d6', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description / Features to Copy</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the styling, components, or functionality you want to reference..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: '#b8c5d6', cursor: 'pointer', fontWeight: 600 }}
          >Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            style={{ padding: '10px 20px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600 }}
          >Save Reference</button>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  // Initial default files
  const tiimoFiles = {
    'src/App.css': `/* Tiimo-inspired Design System */
:root {
  --primary: #6c7cdd;
  --primary-light: #eef0fb;
  --bg-main: #fdfcfb;
  --bg-card: #ffffff;
  --text-main: #2d2d2d;
  --text-muted: #8e8e93;
  --accent-green: #06d6a0;
  --accent-yellow: #ffd166;
  --accent-pink: #ef476f;
  --border-radius: 24px;
  --nav-height: 80px;
  --safe-area-bottom: 20px;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f0f5;
  color: var(--text-main);
}

#root {
  height: 100%;
}

/* Custom Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d1d6;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a6;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  background: var(--bg-main);
  position: relative;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
}

/* Header */
.header {
  padding: 30px 24px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header h1 {
  font-size: 2rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.ai-sparkle-btn {
  background: var(--primary-light);
  border: none;
  border-radius: 16px;
  width: 48px;
  height: 48px;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--primary);
}

.ai-sparkle-btn:active { transform: scale(0.9); }

/* Main Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 20px;
}

/* Task Cards */
.section-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-muted);
  margin: 24px 0 12px;
  font-weight: 700;
}

.task-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 18px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  border-left: 8px solid var(--primary);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:active { transform: scale(0.97); }

.task-icon {
  font-size: 1.6rem;
  background: #f8f9fa;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.task-info {
  flex: 1;
}

.task-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.task-info p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Focus View */
.focus-view {
  position: absolute;
  inset: 0;
  background: white;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
  text-align: center;
}

.back-btn {
  position: absolute;
  left: 24px;
  top: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f0f7;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-main);
  transition: background 0.2s;
}

.back-btn:active { background: #e0e0e7; }

.focus-timer-ring {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 20px 0;
}

.timer-svg {
  transform: rotate(-90deg);
}

.timer-text {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.subtasks-container {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  padding-bottom: 20px;
}

.step-card {
  background: #f9f9fb;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.step-card.completed {
  opacity: 0.6;
  background: #f0f0f0;
  text-decoration: line-through;
}

.step-card.active {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 4px 12px rgba(108, 124, 221, 0.1);
}

.step-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
}

.step-card.completed .step-checkbox {
  background: var(--accent-green);
  border-color: var(--accent-green);
}

/* Bottom Nav */
.bottom-nav {
  height: var(--nav-height);
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-shrink: 0;
  padding-bottom: var(--safe-area-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: color 0.2s;
  flex: 1;
}

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  font-size: 1.5rem;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-sheet {
  background: white;
  width: 100%;
  border-radius: 32px 32px 0 0;
  padding: 32px 24px;
  max-height: 95vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.input-group input, .input-group select {
  width: 100%;
  padding: 16px;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  background: #f9f9f9;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  color: var(--text-main); /* Explicitly set text color to fix white-on-white issue */
}

.input-group input::placeholder {
  color: #b0b0b5;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.type-selector {
  display: flex;
  background: #f0f0f7;
  padding: 4px;
  border-radius: 14px;
  margin-bottom: 24px;
}

.type-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-muted);
}

.type-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  color: var(--primary);
}

.duration-chips {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 8px 16px;
  background: #f0f0f7;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-main);
}

.chip.active {
  background: var(--primary);
  color: white;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 20px;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f7;
  color: var(--text-main);
  border: none;
  padding: 16px;
  border-radius: 16px;
  width: 100%;
  margin-top: 12px;
  font-weight: 700;
  cursor: pointer;
}

.controls-row {
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 10px;
  flex-shrink: 0;
}
`,
    'src/App.jsx': `import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tiimo_v3_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Morning Routine', time: '08:00', duration: 30, icon: '🚿', color: '#06d6a0', steps: ['Brush teeth', 'Shower', 'Get dressed'], isAnytime: false },
      { id: '2', title: 'Deep Work', time: '09:30', duration: 90, icon: '💻', color: '#6c7cdd', steps: ['Check emails', 'Code feature', 'Review PRs'], isAnytime: false },
      { id: '3', title: 'Read Book', time: null, duration: 20, icon: '📚', color: '#ffd166', steps: ['Find a cozy spot', 'Read 10 pages'], isAnytime: true },
    ];
  });

  const [activeTask, setActiveTask] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tiimo_v3_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task) => {
    setTasks([...tasks, { ...task, id: uuidv4() }]);
    setIsAddModalOpen(false);
  };

  const startTask = (task) => {
    setActiveTask(task);
    setActiveTab('focus');
  };

  const completeTask = () => {
    setTasks(tasks.filter(t => t.id !== activeTask.id));
    setActiveTask(null);
    setActiveTab('today');
  };

  return (
    <div className="app-container">
      {activeTab === 'today' && (
        <TodayView 
          tasks={tasks} 
          onStartTask={startTask} 
          onAddClick={() => setIsAddModalOpen(true)} 
        />
      )}
      
      {activeTab === 'todo' && (
        <TodoView 
          tasks={tasks.filter(t => t.isAnytime)} 
          onStartTask={startTask} 
          onAddClick={() => setIsAddModalOpen(true)}
        />
      )}

      {activeTab === 'focus' && (
        <FocusView 
          task={activeTask} 
          onEnd={completeTask} 
          onClose={() => setActiveTab('today')} 
        />
      )}

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasActiveTask={!!activeTask} 
      />

      {isAddModalOpen && (
        <AddModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddTask} 
        />
      )}
    </div>
  );
};

const TodayView = ({ tasks, onStartTask, onAddClick }) => {
  const scheduled = tasks.filter(t => !t.isAnytime).sort((a, b) => a.time.localeCompare(b.time));
  const anytime = tasks.filter(t => t.isAnytime);

  return (
    <>
      <header className="header">
        <h1>Today</h1>
        <button className="ai-sparkle-btn" onClick={onAddClick}>✨</button>
      </header>
      <main className="content-area">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🌈</span>
            <h3>All clear for today!</h3>
            <p>Tap the sparkle to add a new task.</p>
          </div>
        ) : (
          <>
            {scheduled.length > 0 && (
              <>
                <div className="section-title">Schedule</div>
                {scheduled.map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => onStartTask(task)} />
                ))}
              </>
            )}
            
            {anytime.length > 0 && (
              <>
                <div className="section-title">Anytime</div>
                {anytime.map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => onStartTask(task)} />
                ))}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

const TaskCard = ({ task, onClick }) => (
  <div className="task-card" style={{ borderLeftColor: task.color }} onClick={onClick}>
    <div className="task-icon">{task.icon}</div>
    <div className="task-info">
      <h3>{task.title}</h3>
      <p>{task.isAnytime ? 'Anytime' : task.time} • {task.duration} min</p>
    </div>
    <div style={{ color: '#ccc', fontSize: '1.2rem' }}>→</div>
  </div>
);

const FocusView = ({ task, onEnd, onClose }) => {
  if (!task) return null;
  
  const [timeLeft, setTimeLeft] = useState(task.duration * 60);
  const [isActive, setIsActive] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (task.duration * 60 - timeLeft) / (task.duration * 60);
  const offset = circumference - progress * circumference;

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return \`\${m}:\${rs < 10 ? '0' : ''}\${rs}\`;
  };

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  return (
    <div className="focus-view">
      <button className="back-btn" onClick={onClose}>✕</button>
      
      <h2 style={{ fontSize: '1.6rem', margin: '60px 0 0', fontWeight: 800 }}>{task.icon} {task.title}</h2>
      
      <div className="focus-timer-ring">
        <svg className="timer-svg" width="240" height="240">
          <circle cx="120" cy="120" r={radius} fill="none" stroke="#f0f0f7" strokeWidth="14" />
          <circle 
            cx="120" cy="120" r={radius} fill="none" 
            stroke={task.color} strokeWidth="14" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-text">{formatTime(timeLeft)}</div>
      </div>

      <div className="subtasks-container">
        <div className="section-title">Checklist</div>
        {task.steps.length > 0 ? task.steps.map((step, i) => (
          <div 
            key={i} 
            className={\`step-card \${completedSteps.includes(i) ? 'completed' : ''} \${!completedSteps.includes(i) && (completedSteps.length === i) ? 'active' : ''}\`}
            onClick={() => toggleStep(i)}
          >
            <div className="step-checkbox">
              {completedSteps.includes(i) && '✓'}
            </div>
            <span style={{ fontWeight: 600 }}>{step}</span>
          </div>
        )) : (
          <p style={{ color: '#aaa', fontStyle: 'italic' }}>No steps defined.</p>
        )}
      </div>

      <div className="controls-row">
        <button 
          className="btn-secondary" 
          style={{ flex: 1, marginTop: 0 }} 
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button 
          className="btn-primary" 
          style={{ flex: 2 }} 
          onClick={onEnd}
        >
          Finish Task
        </button>
      </div>
    </div>
  );
};

const TodoView = ({ tasks, onStartTask, onAddClick }) => (
  <>
    <header className="header">
      <h1>To-Do</h1>
      <button className="ai-sparkle-btn" onClick={onAddClick}>✨</button>
    </header>
    <main className="content-area">
      <p style={{ color: '#888', marginBottom: 24, fontSize: '0.95rem' }}>Your brain dump of unscheduled tasks.</p>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📝</span>
          <h3>No to-dos yet</h3>
          <p>Add tasks without a specific time here.</p>
        </div>
      ) : (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onStartTask(task)} />
        ))
      )}
    </main>
  </>
);

const BottomNav = ({ activeTab, setActiveTab, hasActiveTask }) => (
  <nav className="bottom-nav">
    <div className={\`nav-item \${activeTab === 'today' ? 'active' : ''}\`} onClick={() => setActiveTab('today')}>
      <span className="nav-icon">📅</span>
      <span>Today</span>
    </div>
    <div className={\`nav-item \${activeTab === 'todo' ? 'active' : ''}\`} onClick={() => setActiveTab('todo')}>
      <span className="nav-icon">📝</span>
      <span>To-Do</span>
    </div>
    <div 
      className={\`nav-item \${activeTab === 'focus' ? 'active' : ''}\`} 
      onClick={() => hasActiveTask && setActiveTab('focus')}
      style={{ opacity: hasActiveTask ? 1 : 0.3 }}
    >
      <span className="nav-icon">⏱️</span>
      <span>Focus</span>
    </div>
  </nav>
);

const AddModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [isAnytime, setIsAnytime] = useState(false);
  const [steps, setSteps] = useState(['']);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title,
      time: isAnytime ? null : time,
      duration: parseInt(duration) || 15,
      isAnytime,
      icon: ['🎯', '⚡', '🧘', '🍎', '🎨', '🧹'][Math.floor(Math.random() * 6)],
      color: ['#6c7cdd', '#06d6a0', '#ffd166', '#ef476f'][Math.floor(Math.random() * 4)],
      steps: steps.filter(s => s.trim() !== '')
    });
  };

  const updateStep = (index, val) => {
    const newSteps = [...steps];
    newSteps[index] = val;
    if (index === steps.length - 1 && val !== '') {
      newSteps.push('');
    }
    setSteps(newSteps);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="type-selector">
          <button 
            className={\`type-btn \${!isAnytime ? 'active' : ''}\`} 
            onClick={() => setIsAnytime(false)}
          >Scheduled</button>
          <button 
            className={\`type-btn \${isAnytime ? 'active' : ''}\`} 
            onClick={() => setIsAnytime(true)}
          >Anytime</button>
        </div>

        <div className="input-group">
          <label>Task Name</label>
          <input 
            autoFocus
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Morning Yoga" 
          />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {!isAnytime && (
            <div className="input-group" style={{ flex: 1 }}>
              <label>Start Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          )}
          <div className="input-group" style={{ flex: 1 }}>
            <label>Duration</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
            <div className="duration-chips">
              {[15, 30, 60].map(d => (
                <div 
                  key={d} 
                  className={\`chip \${duration === d ? 'active' : ''}\`} 
                  onClick={() => setDuration(d)}
                >{d}m</div>
              ))}
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Checklist Steps</label>
          {steps.map((step, i) => (
            <input 
              key={i}
              value={step}
              onChange={e => updateStep(i, e.target.value)}
              placeholder={i === 0 ? "Add a step..." : "Next step..."}
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>

        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={!title.trim()}
        >
          Create Task
        </button>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default App;`,
    'readme.md': `# Tiimo-Style Planner

A beautiful, focus-oriented task planner inspired by Tiimo. 

## Features
- **Visual Day Timeline**: See your day at a glance.
- **Focus Timer**: Immersive timer with visual progress ring.
- **Smart Tasks**: Support for scheduled and "anytime" tasks.
- **Checklists**: Break tasks down into smaller steps.
- **Data Persistence**: Uses LocalStorage to save your tasks.`
  };

  const defaultFiles = {
    'src/App.css': `body {
  font-family: 'Inter', sans-serif;
  padding: 40px;
  text-align: center;
  background: #f0f2f5;
  color: #333;
}
.wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
h1 { color: #6c7cdd; margin-bottom: 20px; }
p { line-height: 1.6; color: #666; }`,
    'src/App.jsx': `import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="wrapper">
      <h1>✨ New Project</h1>
      <p>This is a blank slate. Use the AI Builder to describe what you want to create!</p>
    </div>
  );
};

export default App;`,
    'readme.md': '# New Project\n\nStart building something amazing!'
  };

  // Load from localStorage or use default
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('vfs_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }

    // Migrate from old single-app format if it exists
    const savedOld = localStorage.getItem('vfs_files');
    // If no saved projects, we initialize with Tiimo files for the very first experience
    let initialFiles = tiimoFiles;
    if (savedOld) {
      try {
        initialFiles = JSON.parse(savedOld);
      } catch (e) { }
    }

    return [{
      id: 'default',
      name: 'My First App',
      logo: '🚀',
      files: initialFiles,
      lastModified: Date.now()
    }];
  });

  const [currentProjectId, setCurrentProjectId] = useState(() => {
    return localStorage.getItem('vfs_current_project_id') || projects[0].id;
  });

  const [view, setView] = useState('dashboard'); // 'dashboard' or 'editor'

  // Get current project and files
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];
  const files = currentProject.files;

  // Optimized setFiles that updates the specific project
  const setFiles = useCallback((newFilesOrUpdater) => {
    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        const nextFiles = typeof newFilesOrUpdater === 'function'
          ? newFilesOrUpdater(p.files)
          : newFilesOrUpdater;
        return { ...p, files: nextFiles, lastModified: Date.now() };
      }
      return p;
    }));
  }, [currentProjectId]);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [bundledCode, setBundledCode] = useState('');
  const [isAiInputVisible, setIsAiInputVisible] = useState(false);
  const [referenceApp, setReferenceApp] = useState({ url: '', description: '' });
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState('medium');
  const [thinkingProcess, setThinkingProcess] = useState('');
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState(null); // { data: base64, mimeType: string }

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false); // Stop logic handled by end event usually, but we can force stop if needed
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data URL prefix e.g. "data:image/jpeg;base64,"
        const base64Data = reader.result.split(',')[1];
        setAttachment({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: '✨' });
    }
    // Also play a sound
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Gentle chime
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed', e));
    } catch (e) { }
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vfs_projects', JSON.stringify(projects));
    localStorage.setItem('vfs_current_project_id', currentProjectId);
  }, [projects, currentProjectId]);

  // Debounce files update to prevent excessive bundling
  const [debouncedFiles, setDebouncedFiles] = useState(files);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFiles(files);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [files]);

  // Bundle on change (now debounced)
  useEffect(() => {
    const runBundle = async () => {
      if (!debouncedFiles) return;
      try {
        const { code, dependencies } = await bundle(debouncedFiles);

        // Load external dependencies
        const loadedModules = {};
        if (dependencies.length > 0) {
          setStatus(`Loading dependencies: ${dependencies.join(', ')}...`);
          await Promise.all(dependencies.map(async (dep) => {
            try {
              // Use esm.sh for dependencies
              const module = await import(/* @vite-ignore */ `https://esm.sh/${dep}`);
              loadedModules[dep] = module;
            } catch (e) {
              console.error(`Failed to load ${dep}:`, e);
              throw new Error(`Failed to load dependency: ${dep}`);
            }
          }));
        }

        setBundledCode({ code, externalModules: loadedModules });
        setStatus('Bundled successfully.');
      } catch (err) {
        setStatus(`Bundle Error: ${err.message}`);
      }
    };
    runBundle();
  }, [debouncedFiles]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the project? All changes will be lost.')) {
      setFiles(defaultFiles);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setThinkingProcess(''); // Clear previous thought
    setIsThinkingExpanded(false);

    const statusMessages = {
      minimal: 'AI is using minimal thought...',
      low: 'AI is thinking briefly...',
      medium: 'AI is thinking deeply...',
      high: 'AI is using maximum thought...'
    };
    setStatus(statusMessages[thinkingLevel] || 'AI is thinking...');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const genAI = new GoogleGenerativeAI(apiKey);

      const selectedModel = thinkingLevel === 'ultrafast' || thinkingLevel === 'ultrafast' ? "gemini-2.0-flash-lite-preview-02-05" : "gemini-3-flash-preview";

      // Use System Instructions for better reliability
      const model = genAI.getGenerativeModel({
        model: selectedModel,
        systemInstruction: `You are an expert React developer. 
        You modify a Virtual File System (VFS) based on user requests.
        
        CRITICAL INSTRUCTION:
        First, output your thinking process wrapped in <Thinking> tags. Explain your plan, design choices, and how you will fit the app to the screen.
        Then, output the JSON object.
        
        Example Output:
        <Thinking>
        I will add a button...
        </Thinking>
        {
          "files": ...
        }

        ALWAYS return a valid JSON object after the thinking tags.
        ONLY include files that were modified or created.
        
        DESIGN PHILOSOPHY:
        - All apps must be "Fit to Screen". 
        - DO NOT allow scrolling. Everything must be visible at once.
        - Use flexbox and '100%' or '100vh' heights strategically.
        - Prefer responsive designs that fill the container width and height.
        
        OUTPUT SCHEMA:
        {
          "files": {
            "path/to/file.jsx": "Full updated content"
          },
          "deletedFiles": ["path/to/file.js"]
        }`,
      });

      const THINKING_CONFIGS = {
        ultrafast: { temperature: 1.0, topP: 0.95, topK: 40 }, // High config for fast/loose model
        minimal: { temperature: 0.1, topP: 0.8, topK: 10 },
        low: { temperature: 0.3, topP: 0.9, topK: 25 },
        medium: { temperature: 0.6, topP: 0.95, topK: 45 },
        high: { temperature: 0.9, topP: 0.99, topK: 80 }
      };

      const config = THINKING_CONFIGS[thinkingLevel] || THINKING_CONFIGS.medium;

      const generationConfig = {
        ...config,
        maxOutputTokens: 32000,
        responseMimeType: "application/json",
      };

      const parts = [
        {
          text: `VFS: ${JSON.stringify(files)}\n\n` +
            (referenceApp.url || referenceApp.description ? `REFERENCE APP INFO:\nURL: ${referenceApp.url}\nDescription: ${referenceApp.description}\n\n` : '') +
            `USER REQUEST: ${prompt}`
        }
      ];

      if (attachment) {
        parts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.data
          }
        });
      }

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: parts
        }],
        generationConfig
      });

      const response = result.response;
      let text = response.text();

      // Extract thinking process
      const thinkingMatch = text.match(/<Thinking>([\s\S]*?)<\/Thinking>/i);
      if (thinkingMatch) {
        setThinkingProcess(thinkingMatch[1].trim());
        text = text.replace(/<Thinking>[\s\S]*?<\/Thinking>/i, '').trim();
      }

      try {
        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '');
        const changes = JSON.parse(text);

        setFiles(prev => {
          const newFiles = { ...prev };

          // Handle deletions
          if (changes.deletedFiles && Array.isArray(changes.deletedFiles)) {
            changes.deletedFiles.forEach(file => {
              delete newFiles[file];
            });
          }

          // Handle updates/creations
          if (changes.files && typeof changes.files === 'object') {
            Object.entries(changes.files).forEach(([name, content]) => {
              newFiles[name] = content;
            });
          } else if (!changes.files && !changes.deletedFiles) {
            // Fallback for legacy response format (direct object)
            Object.entries(changes).forEach(([name, content]) => {
              if (typeof content === 'string') newFiles[name] = content;
            });
          }

          return newFiles;
        });

        setStatus('Changes applied!');
        sendNotification('Build Complete! 🚀', 'Your app has been updated successfully.');
        setPrompt('');
        setAttachment(null);
      } catch (e) {
        console.error("JSON Parse Error", e);
        console.error("Raw response text:", text);
        setStatus('Error parsing AI response');
        sendNotification('Build Failed ❌', 'There was an error parsing the AI response.');
      }
    } catch (err) {
      console.error(err);
      setStatus('AI Error: ' + err.message);
      sendNotification('AI Error ⚠️', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = (name, useDemoTemplate = false) => {
    const newProject = {
      id: Date.now().toString(),
      name: name,
      logo: useDemoTemplate ? '📅' : '✨',
      files: useDemoTemplate ? { ...tiimoFiles } : { ...defaultFiles },
      lastModified: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setView('editor');
  };

  const handleDeleteProject = (id) => {
    if (projects.length <= 1) {
      alert("You must have at least one app.");
      return;
    }
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (currentProjectId === id) {
      setCurrentProjectId(newProjects[0].id);
    }
  };

  const handleSelectProject = (id) => {
    setCurrentProjectId(id);
    setView('editor');
  };

  const handleCloneProject = (id) => {
    const parent = projects.find(p => p.id === id);
    if (!parent) return;
    const newProject = {
      ...parent,
      id: Date.now().toString(),
      name: `${parent.name} (Copy)`,
      lastModified: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setView('editor');
  };

  const handleRenameProject = (id, newName) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleUpdateLogo = (id, newLogo) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, logo: newLogo } : p));
  };

  const handleClearData = () => {
    if (confirm('⚠️ DANGER ZONE ⚠️\n\nAre you sure you want to clear ALL your data?\nThis will remove all your projects and reset the app to its factory state.\n\nThis action cannot be undone.')) {
      localStorage.clear();
      // Initialize with default state
      const initialProject = {
        id: 'default',
        name: 'My First App',
        logo: '🚀',
        files: { ...tiimoFiles }, // Reset to Tiimo demo on factory reset
        lastModified: Date.now()
      };
      setProjects([initialProject]);
      setCurrentProjectId(initialProject.id);
      setView('dashboard');
    }
  };

  // Runtime Component to execute the bundled code
  const RuntimeApp = useCallback(() => {
    if (!bundledCode || !bundledCode.code) return null;
    try {
      // We wrap the bundle to return the export of the entry point
      const wrappedCode = bundledCode.code + '\nreturn require("src/App.jsx").default;';

      const func = new Function('window', 'Promise', 'console', 'setTimeout', 'setInterval', 'externalModules', wrappedCode);
      const Component = func(window, Promise, console, setTimeout, setInterval, bundledCode.externalModules);

      return Component ? (
        <div className="runtime-preview">
          <Component />
        </div>
      ) : (
        <div style={{ padding: '20px', color: '#666' }}>No default export from App.jsx</div>
      );
    } catch (err) {
      return (
        <div style={{ color: '#ff4d4d', padding: '20px', background: '#fff' }}>
          <h3>Runtime Error</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{err.message}</pre>
        </div>
      );
    }
  }, [bundledCode]);

  const renderMobileContent = () => {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#F9FAFB', position: 'relative' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
          <div className="runtime-preview-container" style={{
            background: 'white',
            borderRadius: '20px',
            height: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <RuntimeApp />
          </div>
        </div>

        {/* Floating AI Toggle Button */}
        <button
          onClick={() => setIsAiInputVisible(!isAiInputVisible)}
          className="mobile-ai-toggle"
          style={{
            position: 'absolute',
            bottom: isAiInputVisible ? '140px' : '85px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            background: isAiInputVisible ? 'rgba(255,255,255,0.1)' : 'var(--gradient-primary)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            color: 'white',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isAiInputVisible ? '❌' : '✨'}
        </button>

        {isAiInputVisible && (
          <div className="mobile-chat-container">
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', overflowX: 'auto', paddingBottom: '4px', pointerEvents: 'auto' }}>
              {[
                { id: 'minimal', icon: '⚡' },
                { id: 'low', icon: '🧠' },
                { id: 'medium', icon: '🧬' },
                { id: 'high', icon: '🔮' },
                { id: 'ultrafast', icon: '🚀' }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => setThinkingLevel(level.id)}
                  style={{
                    padding: '6px 10px',
                    background: thinkingLevel === level.id ? 'var(--gradient-primary)' : 'rgba(20, 27, 45, 0.8)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '20px',
                    color: thinkingLevel === level.id ? 'white' : '#b8c5d6',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {level.icon} {level.id.charAt(0).toUpperCase() + level.id.slice(1)}
                </button>
              ))}
            </div>
            <div className="mobile-chat-inner">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe changes..."
                style={{ flex: 1, minWidth: 0, padding: '10px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                onClick={() => setIsReferenceModalOpen(true)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: (referenceApp.url || referenceApp.description) ? 'rgba(79, 172, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  color: (referenceApp.url || referenceApp.description) ? '#4facfe' : '#b8c5d6',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >🔗</button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mobile-chat-send"
              >{loading ? '⚡' : '🚀'}</button>
            </div>
            {status && <div className="mobile-status-pill">{status}</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0e27 0%, #141b2d 50%, #1a0a27 100%)'
    }}>

      {view === 'dashboard' ? (
        <ProjectDashboard
          projects={projects}
          currentProjectId={currentProjectId}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          onCloneProject={handleCloneProject}
          onRenameProject={handleRenameProject}
          onUpdateLogo={handleUpdateLogo}
          onClearData={handleClearData}
        />
      ) : (
        <>
          {/* Desktop Toolbar (Hidden on Mobile) */}
          <div className="hide-on-mobile" style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(20, 27, 45, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 100
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => setView('dashboard')}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#b8c5d6',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
              >🏠 Apps</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  overflow: 'hidden'
                }}>
                  {currentProject.logo?.startsWith('http') || currentProject.logo?.startsWith('data:') ? (
                    <img src={currentProject.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                  ) : (
                    currentProject.logo || currentProject.name[0].toUpperCase()
                  )}
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}>{currentProject.name}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#b8c5d6',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2), 0 0 20px rgba(102, 126, 234, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              >🔄 Reset</button>
            </div>
          </div>

          {/* Mobile Header (Visible only on Mobile Editor View) */}
          {view === 'editor' && (
            <div className="show-on-mobile mobile-editor-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setView('dashboard')}
                  style={{ background: 'none', border: 'none', color: '#b8c5d6', fontSize: '1.2rem', padding: '5px' }}
                >◀</button>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '6px', background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', overflow: 'hidden'
                }}>
                  {currentProject.logo?.startsWith('http') || currentProject.logo?.startsWith('data:') ? (
                    <img src={currentProject.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                  ) : (
                    currentProject.logo || currentProject.name[0].toUpperCase()
                  )}
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{currentProject.name}</span>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

            {/* Desktop View */}
            <div className="hide-on-mobile" style={{ width: '100%', height: '100%', display: 'flex' }}>
              {/* Build Side Panel */}
              <div style={{
                width: '380px',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(10, 14, 39, 0.7)',
                borderRight: '1px solid rgba(102, 126, 234, 0.2)',
                backdropFilter: 'blur(40px)',
                padding: '30px',
                gap: '24px'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>AI Builder</h3>
                  <p style={{ color: '#b8c5d6', lineHeight: 1.5 }}>Tell AI what you want to change, and watch the app rebuild in real-time.</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to build..."
                      style={{
                        width: '100%',
                        height: '120px',
                        padding: '15px',
                        background: 'rgba(10, 14, 39, 0.4)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '1rem',
                        resize: 'none',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleVoiceInput}
                        className={isListening ? 'listening' : ''}
                        style={{
                          background: isListening ? '#ef476f' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        title="Voice Dictation"
                      >
                        🎤
                      </button>
                      <label
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          border: attachment ? '2px solid #06d6a0' : 'none'
                        }}
                        title="Take Photo / Upload Image"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageSelect}
                          style={{ display: 'none' }}
                        />
                        {attachment ? '✅' : '📷'}
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setIsReferenceModalOpen(true)}
                      style={{
                        padding: '10px 15px',
                        background: (referenceApp.url || referenceApp.description) ? 'rgba(79, 172, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '12px',
                        color: (referenceApp.url || referenceApp.description) ? '#4facfe' : '#b8c5d6',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        fontWeight: 600
                      }}
                    >
                      <span>🔗</span>
                      {(referenceApp.url || referenceApp.description) ? 'Reference Added' : 'Add Reference App'}
                    </button>
                    {(referenceApp.url || referenceApp.description) && (
                      <button
                        onClick={() => setReferenceApp({ url: '', description: '' })}
                        style={{
                          padding: '10px',
                          background: 'rgba(255, 77, 77, 0.1)',
                          border: '1px solid rgba(255, 77, 77, 0.2)',
                          borderRadius: '12px',
                          color: '#ff4d4d',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                        title="Clear Reference"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#b8c5d6', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thinking Level</span>
                      <span style={{ color: '#4facfe', fontSize: '0.8rem', fontWeight: 700 }}>{thinkingLevel.toUpperCase()}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      padding: '4px',
                      border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                      {[
                        { id: 'minimal', label: 'Min', icon: '⚡' },
                        { id: 'low', label: 'Low', icon: '🧠' },
                        { id: 'medium', label: 'Med', icon: '🧬' },
                        { id: 'high', label: 'Higher', icon: '🔮' },
                        { id: 'ultrafast', label: 'Ultra', icon: '🚀' }
                      ].map(level => (
                        <button
                          key={level.id}
                          onClick={() => setThinkingLevel(level.id)}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            background: thinkingLevel === level.id ? 'var(--gradient-primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: thinkingLevel === level.id ? 'white' : '#b8c5d6',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '0.9rem' }}>{level.icon}</span>
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    style={{
                      padding: '20px',
                      background: loading ? 'rgba(79, 172, 254, 0.3)' : 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {loading ? '⚡ Rebuilding...' : '✨ Generate Changes'}
                  </button>
                  {status && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(79, 172, 254, 0.1)',
                      border: '1px solid rgba(79, 172, 254, 0.2)',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      color: '#4facfe'
                    }}>
                      {status}
                    </div>
                  )}

                  {thinkingProcess && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'none',
                          border: 'none',
                          color: '#b8c5d6',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🧠 AI Thinking
                        </span>
                        <span>{isThinkingExpanded ? '▼' : '▶'}</span>
                      </button>

                      {isThinkingExpanded && (
                        <div style={{
                          padding: '15px',
                          borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                          color: '#b8c5d6',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          background: 'rgba(0,0,0,0.2)'
                        }}>
                          {thinkingProcess}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Panel  */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#f5f7fb',
                position: 'relative'
              }}>
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div className="runtime-preview-container" style={{
                    width: '100%',
                    maxWidth: '1200px',
                    height: '100%',
                    background: 'white',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <RuntimeApp />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View Content */}
            <div className="show-on-mobile" style={{ width: '100%', height: 'calc(100% - 110px)', overflow: 'hidden' }}>
              {renderMobileContent()}
            </div>
          </div>
        </>
      )}

      {/* Global Mobile Navigation (Visible in both views) */}
      <div className="show-on-mobile mobile-nav-bar">
        <button
          className={`mobile-nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          <span style={{ fontSize: '1.4rem' }}>🍱</span>
          <span>Apps</span>
        </button>
        <button
          className={`mobile-nav-item ${view === 'editor' ? 'active' : ''}`}
          onClick={() => { setView('editor'); }}
        >
          <span style={{ fontSize: '1.4rem' }}>✨</span>
          <span>Build</span>
        </button>
      </div>

      <ReferenceAppModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
        referenceData={referenceApp}
        onSave={setReferenceApp}
      />

      <style>{`
        .mobile-editor-header {
           padding: 12px 16px;
           background: rgba(20, 27, 45, 0.9);
           backdrop-filter: blur(20px);
           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
           display: flex;
           justify-content: space-between;
           align-items: center;
           z-index: 100;
        }
        .mobile-chat-container {
           position: fixed;
           bottom: 70px;
           left: 0;
           width: 100%;
            padding: 10px 12px;
           z-index: 200;
           pointer-events: none;
        }
        .mobile-chat-inner {
           display: flex;
           align-items: center;
            gap: 8px;
           background: rgba(20, 27, 45, 0.9);
           backdrop-filter: blur(20px);
            padding: 6px 8px;
           border-radius: 35px;
            border: 1px solid rgba(102, 126, 234, 0.3);
           box-shadow: 0 8px 32px rgba(0,0,0,0.4);
           pointer-events: auto;
           max-width: 500px;
           margin: 0 auto;
        }
        .mobile-chat-send {
           width: 40px;
           height: 40px;
           border-radius: 50%;
           background: var(--gradient-primary);
           border: none;
           color: white;
           font-size: 1.2rem;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .mobile-status-pill {
           margin: 10px auto;
           padding: 4px 12px;
           background: rgba(79, 172, 254, 0.2);
           border-radius: 20px;
           font-size: 0.7rem;
           color: #4facfe;
           text-align: center;
           width: fit-content;
           pointer-events: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

         /* Virtual App Scoping & Alignment Fixes */
        .runtime-preview {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          transform-origin: top center;
        }

        .runtime-preview > * {
          max-height: 100%;
          box-sizing: border-box;
        }

        .runtime-preview-container {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default App;
