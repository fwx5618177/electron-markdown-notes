const remote = require('@electron/remote/main').initialize();
const path = require('path');
const { start } = require('./start');
const { createWindow } = require('./createWindow');

start.then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform === 'darwin')   return false;

    app.quit();
})

app.on('activate', (event, hasVisibleWindows) => {
    if(!hasVisibleWindows)  createWindow();
})