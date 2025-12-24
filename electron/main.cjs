const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false, // Allow media access
            allowRunningInsecureContent: false,
        },
        simpleFullscreen: true,
    });

    // Handle media permissions (microphone, camera)
    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log('Permission requested:', permission);
        const allowedPermissions = ['media', 'microphone', 'camera', 'mediaKeySystem'];
        if (allowedPermissions.includes(permission)) {
            callback(true); // Allow the permission request
        } else {
            callback(false);
        }
    });

    // Also handle permission check (for getUserMedia)
    win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
        console.log('Permission check:', permission, requestingOrigin);
        const allowedPermissions = ['media', 'microphone', 'camera', 'mediaKeySystem'];
        return allowedPermissions.includes(permission);
    });

    // In production, load the built index.html.
    // In development, load the Vite dev server URL.
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
    win.loadURL(startUrl);

    if (process.env.ELECTRON_START_URL) {
        // win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- IPC Handlers for Self-Modification ---

// IPC handler removed as we are using runtime compilation.
