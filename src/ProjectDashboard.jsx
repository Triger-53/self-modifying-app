import React, { useState } from 'react';

const ProjectDashboard = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onCloneProject, onRenameProject, onUpdateLogo }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editName, setEditName] = useState('');
    const [logoPickerId, setLogoPickerId] = useState(null);

    const handleCreate = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim());
            setNewProjectName('');
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
        <div style={{
            flex: 1,
            padding: '40px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #0a0e27 0%, #141b2d 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            marginBottom: '8px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800
                        }}>My Apps</h1>
                        <p style={{ color: '#b8c5d6', fontSize: '1.1rem' }}>Create and manage your self-modifying applications</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        + Create New App
                    </button>
                </header>

                {isCreating && (
                    <div style={{
                        marginBottom: '40px',
                        padding: '30px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '20px',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        backdropFilter: 'blur(20px)',
                        animation: 'fadeIn 0.4s ease-out'
                    }}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Enter App Name (e.g. Weather Dashboard)"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') setIsCreating(false);
                            }}
                            style={{
                                flex: 1,
                                padding: '15px 20px',
                                fontSize: '1.1rem',
                                background: 'rgba(10, 14, 39, 0.6)',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleCreate}
                            style={{ padding: '15px 30px', background: 'var(--gradient-primary)', borderRadius: '12px', color: 'white', fontWeight: 600 }}
                        >Create App</button>
                        <button
                            onClick={() => setIsCreating(false)}
                            style={{ padding: '15px 20px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#b8c5d6' }}
                        >Cancel</button>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {projects.map(project => (
                        <div
                            key={project.id}
                            style={{
                                background: 'rgba(20, 27, 45, 0.6)',
                                border: project.id === currentProjectId
                                    ? '2px solid #667eea'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                boxShadow: project.id === currentProjectId
                                    ? '0 12px 40px rgba(102, 126, 234, 0.3)'
                                    : '0 4px 20px rgba(0, 0, 0, 0.2)'
                            }}
                            onClick={() => onSelectProject(project.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.background = 'rgba(20, 27, 45, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(20, 27, 45, 0.6)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLogoPickerId(logoPickerId === project.id ? null : project.id);
                                    }}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '18px',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {project.logo?.startsWith('http') || project.logo?.startsWith('data:') ? (
                                        <img src={project.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                                    ) : (
                                        project.logo || project.name[0].toUpperCase()
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.5)',
                                        fontSize: '0.6rem',
                                        textAlign: 'center',
                                        padding: '2px 0',
                                        opacity: 0,
                                        transition: 'opacity 0.2s'
                                    }} className="logo-edit-hint">EDIT</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCloneProject(project.id);
                                        }}
                                        title="Clone App"
                                        style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '8px', borderRadius: '8px', color: '#667eea', boxShadow: 'none' }}
                                    >👯</button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProjectId(project.id);
                                            setEditName(project.name);
                                        }}
                                        title="Rename App"
                                        style={{ background: 'rgba(240, 147, 251, 0.1)', padding: '8px', borderRadius: '8px', color: '#f093fb', boxShadow: 'none' }}
                                    >✏️</button>
                                </div>
                            </div>

                            {logoPickerId === project.id && (
                                <div
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        position: 'absolute',
                                        top: '100px',
                                        left: '30px',
                                        zIndex: 10,
                                        background: '#1c2538',
                                        border: '1px solid #667eea',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        width: '240px'
                                    }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                                        {emojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    onUpdateLogo(project.id, emoji);
                                                    setLogoPickerId(null);
                                                }}
                                                style={{ fontSize: '1.2rem', padding: '5px', background: 'transparent', boxShadow: 'none' }}
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
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.8rem' }}
                                    />
                                </div>
                            )}

                            {editingProjectId === project.id ? (
                                <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        autoFocus
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleRename(project.id);
                                            if (e.key === 'Escape') setEditingProjectId(null);
                                        }}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #667eea', borderRadius: '6px', color: 'white' }}
                                    />
                                    <button onClick={() => handleRename(project.id)} style={{ padding: '8px', background: '#667eea', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>OK</button>
                                    <button onClick={() => setEditingProjectId(null)} style={{ padding: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', color: '#b8c5d6', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '4px', fontWeight: 700 }}>{project.name}</h3>
                                    <p style={{ color: '#6b7a8f', fontSize: '0.8rem' }}>
                                        Modified: {new Date(project.lastModified).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto'
                            }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    padding: '4px 12px',
                                    borderRadius: '50px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: 600
                                }}>
                                    {Object.keys(project.files).length} Files
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Delete "${project.name}"?`)) {
                                            onDeleteProject(project.id);
                                        }
                                    }}
                                    style={{
                                        background: 'transparent',
                                        color: '#e74c3c',
                                        fontSize: '0.8rem',
                                        padding: '5px 10px',
                                        opacity: 0.6,
                                        boxShadow: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                                >
                                    Delete
                                </button>
                            </div>

                            {project.id === currentProjectId && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#43e97b',
                                    boxShadow: '0 0 10px #43e97b'
                                }}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .logo-edit-hint { opacity: 0; }
                div:hover > .logo-edit-hint { opacity: 1; }
            `}</style>
        </div>
    );
};

export default ProjectDashboard;
