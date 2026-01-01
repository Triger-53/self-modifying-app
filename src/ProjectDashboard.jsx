import React, { useState } from 'react';

const ProjectDashboard = (props) => {
    const { projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onCloneProject, onRenameProject, onUpdateLogo, onClearData } = props;
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editName, setEditName] = useState('');
    const [logoPickerId, setLogoPickerId] = useState(null);
    const [viewFilesProjectId, setViewFilesProjectId] = useState(null);
    const [editingFile, setEditingFile] = useState(null); // { projectId, path, content }
    const [useDemoTemplate, setUseDemoTemplate] = useState(false);

    const handleCreate = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim(), useDemoTemplate);
            setNewProjectName('');
            setUseDemoTemplate(false);
            setIsCreating(false);
        }
    };

    const handleRename = (id) => {
        if (editName.trim()) {
            onRenameProject(id, editName.trim());
            setEditingProjectId(null);
        }
    };

    const emojis = ['🚀', '✨', '🔥', '💎', '🌈', '🧩', '💻', '📱', '🎨', '🎵', '🕹️', '🛡️', '⚡', '🤖', '🌍', '📦'];

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div className="header-info">
                        <h1 className="header-title">My Apps</h1>
                        <p className="header-subtitle">Build and manage your apps</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-create"
                    >
                        <span className="hide-on-very-small">+ Create New App</span>
                        <span className="show-on-very-small">+ App</span>
                    </button>
                </header>

                {isCreating && (
                    <div className="create-modal glass">
                        <input
                            autoFocus
                            type="text"
                            placeholder="App Name (e.g. My Planner)"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') setIsCreating(false);
                            }}
                            className="create-input"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                            <input
                                type="checkbox"
                                id="demo-template"
                                checked={useDemoTemplate}
                                onChange={(e) => setUseDemoTemplate(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: '#667eea' }}
                            />
                            <label htmlFor="demo-template" style={{ color: '#b8c5d6', fontSize: '0.95rem', cursor: 'pointer' }}>
                                Start with Demo App (Tiimo Planner)
                            </label>
                        </div>
                        <div className="create-actions">
                            <button onClick={handleCreate} className="btn-primary">Create</button>
                            <button onClick={() => setIsCreating(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </div>
                )}

                {viewFilesProjectId && (
                    <div className="modal-overlay" onClick={() => {
                        setViewFilesProjectId(null);
                        setEditingFile(null);
                    }}>
                        <div
                            className={`modal-container glass ${editingFile ? 'editing-mode' : ''}`}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: editingFile ? '800px' : '500px', height: editingFile ? '80vh' : 'auto' }}
                        >
                            {!editingFile ? (
                                <>
                                    <div className="modal-header">
                                        <h3>{projects.find(p => p.id === viewFilesProjectId)?.name} Files</h3>
                                        <button onClick={() => setViewFilesProjectId(null)} className="btn-close-modal">✕</button>
                                    </div>
                                    <div className="file-list">
                                        {Object.keys(projects.find(p => p.id === viewFilesProjectId)?.files || {}).sort().map(path => (
                                            <div
                                                key={path}
                                                className="file-row"
                                                onClick={() => {
                                                    const project = projects.find(p => p.id === viewFilesProjectId);
                                                    setEditingFile({
                                                        projectId: project.id,
                                                        path: path,
                                                        content: project.files[path]
                                                    });
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="file-icon">📄</span>
                                                <div className="file-details">
                                                    <span className="file-path">{path}</span>
                                                    <span className="file-meta">
                                                        {projects.find(p => p.id === viewFilesProjectId)?.files[path].length.toLocaleString()} chars
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div className="modal-header">
                                        <h3>Editing {editingFile.path}</h3>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => setEditingFile(null)}
                                                className="btn-secondary"
                                                style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                                            >Cancel</button>
                                            <button
                                                onClick={() => {
                                                    // We need a prop to handle file updates, currently assuming we modify local state only or passed prop
                                                    // Adding a hypothetical callback usage here for completeness, though user didn't explicitly ask for save logic yet, 
                                                    // but implied "open" usually means read/maybe write. 
                                                    // Since we don't have a direct 'onUpdateFile' prop, we'll just close for now or need to lift state.
                                                    // EDIT: To make this functional immediately without massive refactor, I'll assume readonly or just viewing for now as requested "i want o open the files to noting else" -> "nothing else" implies just viewing?
                                                    // Wait, "nothing else" might mean "just open, don't run it".
                                                    // Let's stick to VIEWING primarily.
                                                    setEditingFile(null);
                                                }}
                                                className="btn-primary"
                                                style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                                            >Done</button>
                                        </div>
                                    </div>
                                    <pre style={{
                                        flex: 1,
                                        overflow: 'auto',
                                        padding: '15px',
                                        margin: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#e0e7ff',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all'
                                    }}>
                                        {editingFile.content}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="project-grid">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className={`project-card ${project.id === currentProjectId ? 'active' : ''}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            <div className="project-card-header">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLogoPickerId(logoPickerId === project.id ? null : project.id);
                                    }}
                                    className="project-logo"
                                >
                                    {project.logo?.startsWith('http') || project.logo?.startsWith('data:') ? (
                                        <img src={project.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                                    ) : (
                                        project.logo || project.name[0].toUpperCase()
                                    )}
                                    <div className="logo-edit-hint">EDIT</div>
                                </div>
                                <div className="project-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProjectId(project.id);
                                            setEditName(project.name);
                                        }}
                                        title="Rename"
                                        className="btn-action rename"
                                    >✏️</button>
                                </div>
                            </div>

                            {logoPickerId === project.id && (
                                <div
                                    onClick={e => e.stopPropagation()}
                                    className="logo-picker glass"
                                >
                                    <div className="emoji-grid">
                                        {emojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    onUpdateLogo(project.id, emoji);
                                                    setLogoPickerId(null);
                                                }}
                                                className="btn-emoji"
                                            >{emoji}</button>
                                        ))}
                                    </div>
                                    <input
                                        placeholder="Or paste Image URL..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onUpdateLogo(project.id, e.target.value);
                                                setLogoPickerId(null);
                                            }
                                        }}
                                        className="picker-input"
                                    />
                                </div>
                            )}

                            {editingProjectId === project.id ? (
                                <div onClick={e => e.stopPropagation()} className="rename-container">
                                    <input
                                        autoFocus
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleRename(project.id);
                                            if (e.key === 'Escape') setEditingProjectId(null);
                                        }}
                                        className="rename-input"
                                    />
                                    <button onClick={() => handleRename(project.id)} className="btn-ok">OK</button>
                                    <button onClick={() => setEditingProjectId(null)} className="btn-cancel">✕</button>
                                </div>
                            ) : (
                                <div className="project-info">
                                    <h3 className="project-name">{project.name}</h3>
                                    <p className="project-date">
                                        Modified: {new Date(project.lastModified).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            <div className="project-card-footer">
                                <span className="file-count">
                                    {Object.keys(project.files).length} Files
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewFilesProjectId(project.id);
                                    }}
                                    className="btn-files"
                                    title="View Files"
                                >
                                    📂
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Delete "${project.name}"?`)) {
                                            onDeleteProject(project.id);
                                        }
                                    }}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>

                            {project.id === currentProjectId && (
                                <div className="status-indicator"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .dashboard-container {
                    flex: 1;
                    padding: 40px 20px;
                    overflow-y: auto;
                    background: linear-gradient(135deg, #0a0e27 0%, #141b2d 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: white;
                    min-height: 100vh;
                    -webkit-overflow-scrolling: touch;
                }
                .dashboard-content { width: 100%; max-width: 1000px; }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }
                .header-title {
                        font-size: 2.5rem;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 800;
                        margin-bottom: 5px;
                }
                .header-subtitle { color: #b8c5d6; font-size: 1.1rem; }
                .btn-create {
                    padding: 12px 24px;
                    background: var(--gradient-secondary);
                    color: white;
                    font-weight: 700;
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-create:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(79, 172, 254, 0.6); }

                .create-modal {
                    margin-bottom: 40px;
                    padding: 30px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    animation: fadeIn 0.4s ease-out;
                }
                .create-input {
                    padding: 15px;
                    font-size: 1.1rem;
                    background: rgba(10, 14, 39, 0.6);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    border-radius: 12px;
                    color: white;
                }
                .create-actions { display: flex; gap: 10px; }
                .btn-primary { flex: 1; background: var(--gradient-primary); padding: 12px; border-radius: 10px; font-weight: 600; color: white; }
                .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #b8c5d6; padding: 12px; border-radius: 10px; }

                .project-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }
                .project-card {
                    background: rgba(20, 27, 45, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 25px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .project-card:hover { transform: translateY(-8px); background: rgba(20, 27, 45, 0.8); }
                .project-card.active { border-color: #667eea; box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3); }

                .project-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .project-logo {
                    width: 60px; height: 60px; border-radius: 16px; background: var(--gradient-primary);
                    display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); position: relative; overflow: hidden;
                }
                .logo-edit-hint { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.5); font-size: 0.5rem; text-align: center; opacity: 0; transition: 0.2s; }
                .project-logo:hover .logo-edit-hint { opacity: 1; }

                .project-actions { display: flex; gap: 8px; }
                .btn-action { background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; box-shadow: none; font-size: 1rem; }
                
                .logo-picker { position: absolute; top: 90px; left: 20px; z-index: 100; padding: 15px; width: 220px; border: 1px solid #667eea; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); background: #1a2332; }
                .emoji-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
                .btn-emoji { font-size: 1.2rem; background: transparent; box-shadow: none; padding: 5px; }
                .picker-input { width: 100%; border-radius: 8px; padding: 8px; background: rgba(0,0,0,0.2); color: white; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; }

                .project-name { font-size: 1.3rem; font-weight: 700; margin-bottom: 4px; }
                .project-date { color: #6b7a8f; font-size: 0.8rem; }

                .project-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
                .file-count { font-size: 0.75rem; padding: 4px 10px; border-radius: 50px; background: rgba(102, 126, 234, 0.1); color: #667eea; font-weight: 600; }
                .btn-delete { background: transparent; color: #e74c3c; font-size: 0.75rem; opacity: 0.6; box-shadow: none; border: none; }
                .btn-delete:hover { opacity: 1; }

                .status-indicator { position: absolute; top: 15px; left: 15px; width: 10px; height: 10px; border-radius: 50%; background: #43e97b; box-shadow: 0 0 10px #43e97b; }

                .rename-container { display: flex; gap: 5px; }
                .rename-input { flex: 1; background: rgba(0,0,0,0.3); border: 1px solid #667eea; color: white; padding: 5px 8px; border-radius: 6px; }
                .btn-ok { background: #667eea; color: white; padding: 5px 10px; border-radius: 6px; }
                .btn-cancel { background: transparent; color: #b8c5d6; font-size: 1.2rem; }

                .hide-on-very-small { display: block; }
                .show-on-very-small { display: none; }

                @media (max-width: 600px) {
                    .dashboard-container { padding: 30px 15px; }
                    .header-title { font-size: 1.8rem; }
                    .header-subtitle { font-size: 0.9rem; }
                    .project-grid { grid-template-columns: 1fr; }
                    .dashboard-header { flex-direction: row; align-items: center; gap: 10px; }
                    .hide-on-very-small { display: none; }
                    .show-on-very-small { display: block; }
                    .btn-create { padding: 10px 15px; font-size: 0.9rem; }
                    .project-card { padding: 20px; }
                    .logo-picker { left: 0; right: 0; margin: auto; width: 90%; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
                    display: flex; justify-content: center; align-items: center; z-index: 1000;
                    padding: 20px;
                }
                .modal-container {
                    width: 100%; max-width: 500px; max-height: 80vh;
                    background: #1a2332; border-radius: 20px; border: 1px solid rgba(102, 126, 234, 0.3);
                    display: flex; flex-direction: column; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .modal-header {
                    padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2);
                }
                .modal-header h3 { margin: 0; color: white; }
                .btn-close-modal { background: none; border: none; color: #b8c5d6; font-size: 1.2rem; cursor: pointer; }
                .file-list { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .file-row {
                    display: flex; align-items: center; gap: 12px; padding: 10px;
                    background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
                }
                .file-icon { font-size: 1.2rem; }
                .file-details { display: flex; flex-direction: column; }
                .file-path { color: #e0e7ff; font-size: 0.9rem; font-family: monospace; }
                .file-meta { color: #6b7a8f; font-size: 0.75rem; }
                .btn-files {
                    background: transparent; border: 1px solid rgba(102, 126, 234, 0.3);
                    border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
                    color: #b8c5d6; cursor: pointer; margin-left: auto; margin-right: 10px;
                    font-size: 0.9rem; transition: all 0.2s;
                }
                .btn-files:hover { background: rgba(102, 126, 234, 0.2); color: white; transform: scale(1.1); }

                .dashboard-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    width: 100%;
                    max-width: 1000px;
                    display: flex;
                    justify-content: center;
                }
                .btn-clear-data {
                    background: transparent;
                    color: #b8c5d6;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-clear-data:hover {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                    border-color: rgba(231, 76, 60, 0.3);
                }
            `}</style>

            <footer className="dashboard-footer">
                <button onClick={props.onClearData} className="btn-clear-data">
                    🗑️ Clear All Data & Reset
                </button>
            </footer>
        </div>
    );
};

export default ProjectDashboard;
