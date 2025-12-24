import React, { useState } from 'react';

const FileExplorer = ({ files, onFileSelect, selectedFile, onFileCreate, onFileDelete }) => {
    const [newFileName, setNewFileName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        if (newFileName) {
            onFileCreate(newFileName);
            setNewFileName('');
            setIsCreating(false);
        }
    };

    // Get file icon and color based on extension
    const getFileIcon = (fileName) => {
        if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return { icon: '⚛️', color: '#61dafb' };
        if (fileName.endsWith('.css')) return { icon: '🎨', color: '#264de4' };
        if (fileName.endsWith('.md')) return { icon: '📝', color: '#083fa1' };
        if (fileName.endsWith('.json')) return { icon: '📋', color: '#f7df1e' };
        return { icon: '📄', color: '#b8c5d6' };
    };

    return (
        <div style={{
            width: '260px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(20, 27, 45, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: 'blur(10px)'
            }}>
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Explorer
                </span>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        fontSize: '1.2rem',
                        padding: '4px 10px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: 'white',
                        fontWeight: 'bold',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1) rotate(90deg)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1) rotate(0deg)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }}
                >
                    +
                </button>
            </div>

            {/* Create File Input */}
            {isCreating && (
                <div style={{
                    padding: '12px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Component.jsx"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreate();
                            if (e.key === 'Escape') setIsCreating(false);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            background: 'rgba(10, 14, 39, 0.6)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '6px',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.25s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            )}

            {/* File List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {Object.keys(files).sort().map(fileName => {
                    const { icon, color } = getFileIcon(fileName);
                    const isSelected = selectedFile === fileName;

                    return (
                        <div
                            key={fileName}
                            onClick={() => onFileSelect(fileName)}
                            style={{
                                padding: '10px 12px',
                                margin: '4px 0',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                background: isSelected
                                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
                                    : 'transparent',
                                border: isSelected
                                    ? '1px solid rgba(102, 126, 234, 0.4)'
                                    : '1px solid transparent',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: isSelected ? 'white' : '#b8c5d6',
                                    fontWeight: isSelected ? 600 : 400
                                }}>
                                    {fileName.split('/').pop()}
                                </span>
                            </div>

                            {fileName !== 'src/App.jsx' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFileDelete(fileName);
                                    }}
                                    style={{
                                        border: 'none',
                                        background: 'rgba(231, 76, 60, 0.2)',
                                        color: '#e74c3c',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        padding: '4px 6px',
                                        borderRadius: '4px',
                                        opacity: 0.6,
                                        transition: 'all 0.25s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#e74c3c';
                                        e.target.style.color = 'white';
                                        e.target.style.opacity = '1';
                                        e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(231, 76, 60, 0.2)';
                                        e.target.style.color = '#e74c3c';
                                        e.target.style.opacity = '0.6';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileExplorer;
