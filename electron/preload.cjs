const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    updateCode: (filePath, code) => ipcRenderer.invoke('update-code', { filePath, code }),
});
