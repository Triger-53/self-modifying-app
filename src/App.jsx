import React, { useState, useEffect, useCallback } from 'react';
import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { bundle } from './utils/bundler';
import ProjectDashboard from './ProjectDashboard';

// Expose React globally for the bundled code to find
window.React = ReactModule;
window.ReactDOM = ReactDOMModule;

const App = () => {
  // Initial default files
  const defaultFiles = {
    'src/App.css': `/* General styles for the Tiimo-like app */
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f0f2f5; /* Light grey background */
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start; /* Align to top, not center */
      min-height: 100vh;
      color: #333;
      overflow-y: auto;
  }

.app-container {
  background-color: #ffffff; /* White card background */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 95%;
  max-width: 600px;
  margin: 20px 0;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.header-title {
  color: #6a6a6a;
  font-size: 1.8em;
  font-weight: bold;
  margin: 0;
  text-align: left;
}

.add-task-button {
  background-color: #6c7cdd; /* Tiimo blue */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-task-button:hover {
  background-color: #5a6cd3;
}

.timeline-section {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-section h2 {
  font-size: 1.4em;
  color: #555;
  margin-top: 0;
  margin-bottom: 10px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  background-color: #fdfdfd;
  padding: 12px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 5px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.task-item.active {
  background-color: #e0e7ff; /* Light blue for active task */
  border-left: 5px solid #6c7cdd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  font-weight: bold;
}

.task-item-icon {
  font-size: 1.5em;
  margin-right: 10px;
}

.task-item-time {
  font-weight: 600;
  min-width: 60px;
  margin-right: 10px;
  color: #777;
}

.task-item.anytime .task-item-time {
  font-style: italic;
  color: #999;
}

.task-item-title {
  flex-grow: 1;
  text-align: left;
  font-size: 1.1em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content h2 {
  color: #333;
  font-size: 1.6em;
  margin-top: 0;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
  font-size: 0.95em;
}

.form-group input[type="text"],
.form-group input[type="time"],
.form-group input[type="number"] {
  width: calc(100% - 20px);
  padding: 12px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.2s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="time"]:focus,
.form-group input[type="number"]:focus {
  outline: none;
  border-color: #6c7cdd;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  accent-color: #6c7cdd;
}

.checkbox-group label {
  font-weight: normal;
  color: #555;
  margin-bottom: 0;
}

.color-picker-grid, .icon-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease, transform 0.1s ease;
}

.color-swatch.selected {
  border-color: #6c7cdd;
  transform: scale(1.05);
}

.icon-option {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8em;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  background-color: #f5f5f5;
  transition: border-color 0.2s ease, transform 0.1s ease, background-color 0.2s ease;
}

.icon-option:hover {
  background-color: #e0e7ff;
}

.icon-option.selected {
  border-color: #6c7cdd;
  transform: scale(1.05);
  background-color: #e0e7ff;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
}

.modal-button {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-button.cancel {
  background-color: #e0e0e0;
  color: #555;
}

.modal-button.cancel:hover {
  background-color: #d0d0d0;
}

.modal-button.save {
  background-color: #6c7cdd;
  color: white;
}

.modal-button.save:hover {
  background-color: #5a6cd3;
}

.focus-timer-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 20px;
}

.focus-timer-container h2 {
  color: #6c7cdd;
  font-size: 2em;
  margin-bottom: 20px;
}

.focus-timer-ring {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: conic-gradient(
    #6c7cdd var(--progress, 0%),
    #e0e7ff var(--progress, 0%)
  );
  box-shadow: inset 0 0 0 10px white, 0 0 0 10px #e0e7ff; /* Inner and outer ring effect */
}

.focus-timer-time {
  font-size: 3em;
  font-weight: bold;
  color: #333;
  position: relative;
  z-index: 1;
}

.focus-timer-task-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.focus-timer-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.focus-timer-button {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.focus-timer-button.pause {
  background-color: #f7b731; /* Yellowish for pause */
  color: white;
}

.focus-timer-button.pause:hover {
  background-color: #e6a827;
}

.focus-timer-button.end {
  background-color: #e74c3c; /* Red for end */
  color: white;
}

.focus-timer-button.end:hover {
  background-color: #c0392b;
}`,
    'src/App.jsx': `import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

// Components
const Header = ({ title, onAddTaskClick }) => (
  <div className="header-container">
    <h1 className="header-title">{title}</h1>
    <button className="add-task-button" onClick={onAddTaskClick}>+ Add Task</button>
  </div>
);

const TaskItem = ({ task, onStartTask, isActive, taskColor }) => {
  const itemStyle = { borderColor: taskColor };

  return (
    <div 
      className={\`task-item \${isActive ? 'active' : ''} \${task.isAnytime ? 'anytime' : ''}\`}
      style={itemStyle}
      onClick={() => onStartTask(task)}
    >
      <span className="task-item-icon">{task.icon}</span>
      <span className="task-item-time">
        {task.isAnytime ? 'Anytime' : task.startTime}
      </span>
      <span className="task-item-title">{task.title}</span>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onSaveTask }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [isAnytime, setIsAnytime] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#6c7cdd'); // Default Tiimo blue
  const [selectedIcon, setSelectedIcon] = useState('✨'); // Default sparkle icon

  const colors = ['#6c7cdd', '#ffc107', '#28a745', '#fd7e14', '#e83e8c', '#6f42c1', '#20c997', '#007bff'];
  const icons = [
    '✨', '📚', '☕', '🛒', '🏃‍♂️', '🧘‍♀️', '🚿', '💻', '🍽️', '😴', 
    '📞', '💡', '🎵', '🚗', '🏥', '🎉', '✈️', '🐶', '📝', '💪'
  ];

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setStartTime('');
      setDuration(30);
      setIsAnytime(false);
      setSelectedColor('#6c7cdd');
      setSelectedIcon('✨');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: uuidv4(),
      title,
      startTime: isAnytime ? null : startTime,
      duration,
      isAnytime,
      color: selectedColor,
      icon: selectedIcon,
      isCompleted: false,
    };
    onSaveTask(newTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Study React Hooks"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              id="is-anytime"
              type="checkbox"
              checked={isAnytime}
              onChange={(e) => setIsAnytime(e.target.checked)}
            />
            <label htmlFor="is-anytime">Anytime Task</label>
          </div>

          {!isAnytime && (
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required={!isAnytime}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min="5"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker-grid">
              {colors.map((color) => (
                <div
                  key={color}
                  className={\`color-swatch \${selectedColor === color ? 'selected' : ''}\`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-picker-grid">
              {icons.map((icon) => (
                <div
                  key={icon}
                  className={\`icon-option \${selectedIcon === icon ? 'selected' : ''}\`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-buttons">
            <button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-button save">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FocusTimer = ({ activeTask, onPauseTimer, onEndTimer }) => {
  const [timeRemaining, setTimeRemaining] = useState(activeTask.duration * 60); // seconds
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initialize time remaining when activeTask changes
    setTimeRemaining(activeTask.duration * 60);
    setIsPaused(false);
    startTimer();

    return () => clearInterval(intervalRef.current);
  }, [activeTask]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          onEndTimer(); // Automatically end task when timer runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseResumeTimer = () => {
    if (isPaused) {
      startTimer();
    } else {
      clearInterval(intervalRef.current);
    }
    setIsPaused(!isPaused);
    onPauseTimer(!isPaused); // Notify parent of pause state
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return \`\${minutes < 10 ? '0' : ''}\${minutes}:\${remainingSeconds < 10 ? '0' : ''}\${remainingSeconds}\`;
  };

  const progress = (activeTask.duration * 60 - timeRemaining) / (activeTask.duration * 60) * 100;

  return (
    <div className="focus-timer-container">
      <h2>Focus Time!</h2>
      <p className="focus-timer-task-title">{activeTask.icon} {activeTask.title}</p>
      <div className="focus-timer-ring" style={{'--progress': \`\${progress}%\`}}>
        <span className="focus-timer-time">{formatTime(timeRemaining)}</span>
      </div>
      <div className="focus-timer-buttons">
        <button onClick={pauseResumeTimer} className="focus-timer-button pause">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={onEndTimer} className="focus-timer-button end">End Task</button>
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from local storage or use default
    const savedTasks = localStorage.getItem('tiimo_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: '1', title: 'Morning Routine', startTime: '08:00', duration: 30, isAnytime: false, color: '#28a745', icon: '🚿', isCompleted: false },
      { id: '2', title: 'Breakfast', startTime: '08:30', duration: 20, isAnytime: false, color: '#fd7e14', icon: '🍽️', isCompleted: false },
      { id: '3', title: 'Check Emails', startTime: '09:00', duration: 15, isAnytime: false, color: '#6c7cdd', icon: '💻', isCompleted: false },
      { id: '4', title: 'Read Book', startTime: null, duration: 45, isAnytime: true, color: '#e83e8c', icon: '📚', isCompleted: false },
      { id: '5', title: 'Go for a walk', startTime: '15:00', duration: 60, isAnytime: false, color: '#20c997', icon: '🏃‍♂️', isCompleted: false },
    ];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('tiimo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleStartTask = (task) => {
    setActiveTask(task);
  };

  const handlePauseTimer = (isPaused) => {
    // Logic to handle pause state if needed, e.g., update task status in state
    console.log(\`Task \${activeTask.title} is \${isPaused ? 'paused' : 'resumed'}\`);
  };

  const handleEndTimer = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === activeTask.id ? { ...task, isCompleted: true } : task
      )
    );
    setActiveTask(null);
  };

  const scheduledTasks = tasks
    .filter(task => !task.isAnytime && !task.isCompleted)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const anytimeTasks = tasks
    .filter(task => task.isAnytime && !task.isCompleted);

  return (
    <div className="app-container">
      <Header title={formattedDate} onAddTaskClick={() => setIsModalOpen(true)} />

      {activeTask ? (
        <FocusTimer
          activeTask={activeTask}
          onPauseTimer={handlePauseTimer}
          onEndTimer={handleEndTimer}
        />
      ) : (
        <main className="timeline-section">
          {scheduledTasks.length > 0 && (
            <div className="scheduled-tasks">
              <h2>Today's Schedule</h2>
              <div className="task-list">
                {scheduledTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStartTask={handleStartTask}
                    isActive={activeTask && activeTask.id === task.id}
                    taskColor={task.color}
                  />
                ))}
              </div>
            </div>
          )}

          {anytimeTasks.length > 0 && (
            <div className="anytime-tasks">
              <h2>Anytime</h2>
              <div className="task-list">
                {anytimeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStartTask={handleStartTask}
                    isActive={activeTask && activeTask.id === task.id}
                    taskColor={task.color}
                  />
                ))}
              </div>
            </div>
          )}

          {scheduledTasks.length === 0 && anytimeTasks.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>No tasks scheduled. Click '+ Add Task' to get started!</p>
          )}
        </main>
      )}

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleAddTask}
      />
    </div>
  );
};

export default App;`,
    'readme.md': `# Tiimo Task Planner
A visual task planner and focus timer inspired by Tiimo. 

## Features
- Schedule tasks for specific times
- Create "Anytime" tasks
- Visual focus timer with progress ring
- Custom icons and colors for each task
- Data persistence via LocalStorage`
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
    let initialFiles = defaultFiles;
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
    setStatus('AI is thinking...');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const genAI = new GoogleGenerativeAI(apiKey);

      // Use System Instructions for better reliability
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are an expert React developer. 
        You modify a Virtual File System (VFS) based on user requests.
        ALWAYS return a valid JSON object.
        ONLY include files that were modified or created.
        
        OUTPUT SCHEMA:
        {
          "files": {
            "path/to/file.jsx": "Full updated content"
          },
          "deletedFiles": ["path/to/file.js"]
        }`,
      });

      const generationConfig = {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `VFS: ${JSON.stringify(files)}\n\nUSER REQUEST: ${prompt}` }] }],
        generationConfig
      });

      const response = result.response;
      let text = response.text();

      try {
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
        setPrompt('');
      } catch (e) {
        console.error("JSON Parse Error", e);
        console.error("Raw response text:", text);
        setStatus('Error parsing AI response');
      }
    } catch (err) {
      console.error(err);
      setStatus('AI Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = (name) => {
    const newProject = {
      id: Date.now().toString(),
      name: name,
      logo: '✨',
      files: { ...defaultFiles },
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
            minHeight: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            overflow: 'auto'
          }}>
            <RuntimeApp />
          </div>
        </div>

        <div className="mobile-chat-container">
          <div className="mobile-chat-inner">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe changes..."
              style={{ flex: 1, padding: '14px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mobile-chat-send"
            >{loading ? '⚡' : '🚀'}</button>
          </div>
          {status && <div className="mobile-status-pill">{status}</div>}
        </div>
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
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 'Add a dark mode', 'Change the font to Inter', 'Make a task list with priorities'..."
                    style={{
                      flex: 1,
                      padding: '20px',
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
                    overflow: 'auto',
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
           padding: 15px;
           z-index: 200;
           pointer-events: none;
        }
        .mobile-chat-inner {
           display: flex;
           gap: 10px;
           background: rgba(20, 27, 45, 0.9);
           backdrop-filter: blur(20px);
           padding: 8px;
           border-radius: 35px;
           border: 1px solid rgba(102, 126, 234, 0.4);
           box-shadow: 0 8px 32px rgba(0,0,0,0.4);
           pointer-events: auto;
           max-width: 500px;
           margin: 0 auto;
        }
        .mobile-chat-send {
           width: 44px;
           height: 44px;
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
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          transform-origin: top center;
        }

        .runtime-preview-container {
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) transparent;
        }

        .runtime-preview-container::-webkit-scrollbar {
          width: 6px;
        }

        .runtime-preview-container::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
