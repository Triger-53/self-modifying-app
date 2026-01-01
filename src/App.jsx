import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Babel from '@babel/standalone';
import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FileExplorer from './FileExplorer';
import { bundle } from './utils/bundler';

// Expose React globally for the bundled code to find
window.React = ReactModule;
window.ReactDOM = ReactDOMModule;

const App = () => {
  // Initial default files
  const defaultFiles = {
    'src/App.css': `body {
  font-family: 'Arial', sans-serif;
  background-color: #2c3e50;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #ecf0f1;
  overflow: hidden;
}

.app-container {
  background-color: #34495e;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 500px;
  border: 2px solid #7f8c8d;
}

.header-title {
  color: #e74c3c;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-bottom: 2px solid #7f8c8d;
  padding-bottom: 15px;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.recorder-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.action-button {
  padding: 15px 30px;
  font-size: 1.2em;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
}

.action-button.record-button {
  background-color: #e74c3c; /* Red for record */
}
.action-button.record-button:hover {
  background-color: #c0392b;
}

.action-button.stop-button {
  background-color: #3498db; /* Blue for stop */
}
.action-button.stop-button:hover {
  background-color: #2980b9;
}

.audio-player {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.audio-player audio {
  width: 100%;
}

.download-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.download-button:hover {
  background-color: #27ae60;
}`,
    'src/App.jsx': `import React, { useState, useRef } from 'react';
import Header from './Header';
import './App.css';

const App = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const audioChunks = useRef([]);
  const [audio, setAudio] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [error, setError] = useState(null);

  const addDebug = (message) => {
    console.log('[DEBUG]', message);
    setDebugInfo(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] \${message}\`]);
  };

  const getMicrophonePermission = async () => {
    setError(null);
    addDebug('Get Microphone button clicked');
    
    // Check if MediaRecorder exists
    if (!('MediaRecorder' in window)) {
      const msg = 'MediaRecorder API is not supported on this system.';
      addDebug('ERROR: ' + msg);
      setError(msg);
      alert(msg);
      return;
    }
    addDebug('MediaRecorder API is available');

    // Check if getUserMedia exists
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'getUserMedia is not supported on this system.';
      addDebug('ERROR: ' + msg);
      setError(msg);
      alert(msg);
      return;
    }
    addDebug('getUserMedia API is available');

    try {
      addDebug('Requesting microphone access...');
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      addDebug('Microphone access granted!');
      addDebug(\`Stream tracks: \${streamData.getTracks().length}\`);
      setPermission(true);
      setStream(streamData);
    } catch (err) {
      const msg = \`Error getting microphone: \${err.name} - \${err.message}\`;
      addDebug('ERROR: ' + msg);
      setError(msg);
      alert(msg);
    }
  };

  const startRecording = async () => {
    setError(null);
    addDebug('Start Recording button clicked');
    setRecordingStatus('recording');
    setAudio(null);

    try {
      addDebug('Creating MediaRecorder instance...');
      const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorder.current = media;
      
      addDebug(\`MediaRecorder state: \${media.state}\`);
      addDebug(\`MediaRecorder mimeType: \${media.mimeType}\`);
      
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        addDebug(\`Data available: \${event.data.size} bytes\`);
        if (typeof event.data === 'undefined') return;
        if (event.data.size === 0) return;
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onerror = (event) => {
        const msg = \`MediaRecorder error: \${event.error}\`;
        addDebug('ERROR: ' + msg);
        setError(msg);
      };

      mediaRecorder.current.start();
      addDebug('Recording started');
    } catch (err) {
      const msg = \`Error starting recording: \${err.name} - \${err.message}\`;
      addDebug('ERROR: ' + msg);
      setError(msg);
      setRecordingStatus('inactive');
    }
  };

  const stopRecording = () => {
    setError(null);
    addDebug('Stop Recording button clicked');
    setRecordingStatus('inactive');
    
    try {
      mediaRecorder.current.stop();
      addDebug('Recording stopped');
      
      mediaRecorder.current.onstop = () => {
        addDebug(\`Total chunks collected: \${audioChunks.current.length}\`);
        const totalSize = audioChunks.current.reduce((sum, chunk) => sum + chunk.size, 0);
        addDebug(\`Total audio size: \${totalSize} bytes\`);
        
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        addDebug(\`Blob URL created: \${audioUrl}\`);
        setAudio(audioUrl);
        audioChunks.current = [];
      };
    } catch (err) {
      const msg = \`Error stopping recording: \${err.name} - \${err.message}\`;
      addDebug('ERROR: ' + msg);
      setError(msg);
    }
  };

  return (
    <div className="app-container">
      <Header title="macOS Voice Recorder" />
      <main className="recorder-container">
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            borderRadius: '5px',
            marginBottom: '10px',
            fontSize: '0.9em'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!permission ? (
          <button onClick={getMicrophonePermission} className="action-button" type="button">
            Get Microphone
          </button>
        ) : null}
        
        {permission && recordingStatus === 'inactive' ? (
          <button onClick={startRecording} className="action-button record-button" type="button">
            Start Recording
          </button>
        ) : null}
        
        {recordingStatus === 'recording' ? (
          <button onClick={stopRecording} className="action-button stop-button" type="button">
            Stop Recording
          </button>
        ) : null}
        
        {audio ? (
          <div className="audio-player">
            <audio src={audio} controls></audio>
            <a download="macos-voice-recording.webm" href={audio} className="download-button">
              Download Recording
            </a>
          </div>
        ) : null}

        {/* Debug Console */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#2c3e50',
          borderRadius: '5px',
          maxHeight: '200px',
          overflowY: 'auto',
          width: '100%',
          textAlign: 'left',
          fontSize: '0.75em',
          fontFamily: 'monospace',
          border: '1px solid #7f8c8d'
        }}>
          <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#3498db' }}>
            Debug Console:
          </div>
          {debugInfo.length === 0 ? (
            <div style={{ color: '#95a5a6' }}>No debug messages yet...</div>
          ) : (
            debugInfo.map((msg, idx) => (
              <div key={idx} style={{ 
                color: msg.includes('ERROR') ? '#e74c3c' : '#2ecc71',
                marginBottom: '3px'
              }}>
                {msg}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;`,
    'src/Header.jsx': `import React from 'react';

  const Header = ({ title }) => (
    <h1 className="header-title">{title}</h1>
  );

  export default Header; `,
    'readme.md': `# macOS Voice Recorder

A simple voice recording and playback desktop application for macOS, built with React.This application uses web technologies running in a native desktop shell(e.g., using a framework like Electron or Tauri).

## Description

This project demonstrates how to use the browser's \`MediaRecorder\` API within a React application to capture audio from a user's microphone.It allows users to record their voice, stop the recording, and then play it back or download it.

This application is built with React and utilizes functional components and hooks(\`useState\`, \`useRef\`).

## Features

-   Microphone access request.
-   Start and stop audio recording.
-   Playback of the recorded audio.
-   Download the recording as a \`.webm\` file.
-   Clean, modern UI.

## Getting Started

To run this project in a development environment, you'll need Node.js and npm installed.

1.  **Clone the repository (if applicable) and navigate into the project directory.**

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Start the application:**
    \`\`\`bash
    npm start
    \`\`\`
The application will launch in a new window.

## How to Use

1.  Launch the application.
2.  Click the **"Get Microphone"** button and grant the necessary permission when the system prompts you.
3.  Click the **"Start Recording"** button to begin recording your voice.
4.  When you're finished, click the **"Stop Recording"** button.
5.  An audio player will appear, allowing you to listen to your recording.
6.  You can also click the **"Download Recording"** link to save the audio file to your computer.`
  };

  // Load from localStorage or use default
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('vfs_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved files", e);
      }
    }
    return defaultFiles;
  });

  const [activeFile, setActiveFile] = useState('src/App.jsx');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [bundledCode, setBundledCode] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vfs_files', JSON.stringify(files));
  }, [files]);

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

  const handleFileChange = (newContent) => {
    setFiles(prev => ({ ...prev, [activeFile]: newContent }));
  };

  const handleFileCreate = (name) => {
    // Simple validation
    let fileName = name;
    if (!fileName.startsWith('src/')) fileName = 'src/' + fileName;
    if (!files[fileName]) {
      setFiles(prev => ({ ...prev, [fileName]: `import React from 'react';\n\nexport default () => <div>${fileName}</div>;` }));
      setActiveFile(fileName);
    }
  };

  const handleFileDelete = (name) => {
    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);
    if (activeFile === name) {
      setActiveFile(Object.keys(newFiles)[0] || '');
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
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          maxOutputTokens: 8192,
        }
      });

      const fullPrompt = `You are an expert React developer. 
      
      OBJECTIVE:
      Respond to the user request by modifying the provided file system.
      
      CURRENT FILES:
      ${JSON.stringify(files)}
      
      REQUEST:
      ${prompt}
      
      OUTPUT FORMAT:
      Return ONLY a JSON object. No markdown.
      {
        "files": {
          "filename": "full content"
        },
        "deletedFiles": ["filename"]
      }
      
      CRITICAL: Ensure the JSON is complete and not truncated.`;

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Clean up markdown if present
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const changes = JSON.parse(cleanJson);

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
        setStatus('Error parsing AI response');
      }
    } catch (err) {
      console.error(err);
      setStatus('AI Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the project? All changes will be lost.')) {
      localStorage.removeItem('vfs_files');
      setFiles(defaultFiles);
      setActiveFile('src/App.jsx');
    }
  };

  // Runtime Component to execute the bundled code
  const RuntimeApp = useCallback(() => {
    if (!bundledCode || !bundledCode.code) return null;
    try {
      // We wrap the bundle to return the export of the entry point
      console.log('Bundled Code:', bundledCode.code);
      const wrappedCode = bundledCode.code + '\nreturn require("src/App.jsx").default;';

      const func = new Function('window', 'Promise', 'console', 'setTimeout', 'setInterval', 'externalModules', wrappedCode);
      const Component = func(window, Promise, console, setTimeout, setInterval, bundledCode.externalModules);

      return Component ? <Component /> : <div>No default export from App.jsx</div>;
    } catch (err) {
      return <div style={{ color: 'red' }}><pre>{err.message}</pre></div>;
    }
  }, [bundledCode]);

  // Mobile specific state
  const [mobileTab, setMobileTab] = useState('code'); // 'files', 'code', 'preview'

  const renderMobileContent = () => {
    if (mobileTab === 'files') {
      return (
        <FileExplorer
          files={files}
          selectedFile={activeFile}
          onFileSelect={(file) => {
            setActiveFile(file);
            setMobileTab('code'); // Auto-switch to code on selection
          }}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
        />
      );
    }
    if (mobileTab === 'code') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* AI Input Section */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(20, 27, 45, 0.6)',
            backdropFilter: 'blur(10px)'
          }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="✨ Ask AI to transform your code..."
              style={{
                width: '100%',
                height: '70px',
                padding: '12px',
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                background: 'rgba(10, 14, 39, 0.6)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                color: 'white',
                resize: 'none',
                transition: 'all 0.25s'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '12px' }}>
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading
                    ? 'rgba(102, 126, 234, 0.5)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.25s',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
                  opacity: loading ? 0.7 : 1,
                  flex: 1
                }}
              >
                {loading ? '⚡ Generating...' : '🚀 Generate'}
              </button>
            </div>
          </div>

          <textarea
            value={files[activeFile] || ''}
            onChange={(e) => handleFileChange(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              padding: '16px',
              paddingBottom: '80px', // Space for bottom nav
              background: '#0d1117',
              color: '#e6edf3',
              resize: 'none',
              border: 'none',
              outline: 'none',
              caretColor: '#667eea'
            }}
          />
        </div>
      );
    }
    if (mobileTab === 'preview') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
          <RuntimeApp />
        </div>
      );
    }
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

      {/* Desktop Toolbar (Hidden on Mobile) */}
      <div className="hide-on-mobile" style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(20, 27, 45, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>✨ Ultra IDE</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.2))',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              cursor: 'pointer',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.25s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 16px rgba(231, 76, 60, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.2))';
              e.target.style.color = '#ff6b6b';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >🔄 Reset</button>
          {['editor', 'split', 'preview'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                background: viewMode === mode
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: viewMode === mode
                  ? '1px solid rgba(102, 126, 234, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: viewMode === mode ? 'white' : '#b8c5d6',
                fontWeight: viewMode === mode ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== mode) {
                  e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== mode) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#b8c5d6';
                }
              }}
            >{mode}</button>
          ))}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="show-on-mobile" style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(20, 27, 45, 0.9)',
        backdropFilter: 'blur(20px)'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Ultra IDE</h2>
        <button
          onClick={handleReset}
          style={{
            padding: '6px 12px',
            background: 'rgba(231, 76, 60, 0.2)',
            border: 'none',
            borderRadius: '6px',
            color: '#ff6b6b',
            fontSize: '0.8rem'
          }}
        >🔄</button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Desktop View */}
        <div className="hide-on-mobile" style={{ width: '100%', height: '100%', display: 'flex' }}>
          {/* Editor Area */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div style={{ flex: 1, display: 'flex', borderRight: viewMode === 'split' ? '1px solid #ccc' : 'none' }}>

              {/* File Explorer */}
              <FileExplorer
                files={files}
                selectedFile={activeFile}
                onFileSelect={setActiveFile}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
              />

              {/* Code Editor */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* AI Input Section */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 27, 45, 0.6)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="✨ Ask AI to transform your code..."
                    style={{
                      width: '100%',
                      height: '70px',
                      padding: '12px',
                      boxSizing: 'border-box',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      background: 'rgba(10, 14, 39, 0.6)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      resize: 'none',
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
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '12px' }}>
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      style={{
                        padding: '10px 20px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: loading
                          ? 'rgba(102, 126, 234, 0.5)'
                          : 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'all 0.25s',
                        boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
                        opacity: loading ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }
                      }}
                    >
                      {loading ? '⚡ Generating...' : '🚀 Generate'}
                    </button>
                    {status && (
                      <span style={{
                        fontSize: '0.85rem',
                        color: status.includes('Error') ? '#ff6b6b' : '#4facfe',
                        fontWeight: 500
                      }}>
                        {status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Code Editor */}
                <textarea
                  value={files[activeFile] || ''}
                  onChange={(e) => handleFileChange(e.target.value)}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    padding: '16px',
                    background: '#0d1117',
                    color: '#e6edf3',
                    resize: 'none',
                    border: 'none',
                    outline: 'none',
                    caretColor: '#667eea'
                  }}
                />
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #0a0e27 0%, #141b2d 100%)',
              borderLeft: viewMode === 'split' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              {viewMode === 'split' && (
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 27, 45, 0.6)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#b8c5d6',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>▶️ Live Preview</div>
              )}
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: viewMode === 'split' ? '20px' : '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <RuntimeApp />
              </div>
            </div>
          )}
        </div>

        {/* Mobile View Content */}
        <div className="show-on-mobile" style={{ width: '100%', height: '100%' }}>
          {renderMobileContent()}
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav-bar">
        <button
          className={`mobile-nav-item ${mobileTab === 'files' ? 'active' : ''}`}
          onClick={() => setMobileTab('files')}
        >
          <span style={{ fontSize: '1.5rem' }}>📂</span>
          <span>Files</span>
        </button>
        <button
          className={`mobile-nav-item ${mobileTab === 'code' ? 'active' : ''}`}
          onClick={() => setMobileTab('code')}
        >
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <span>Code</span>
        </button>
        <button
          className={`mobile-nav-item ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <span style={{ fontSize: '1.5rem' }}>▶️</span>
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default App;
