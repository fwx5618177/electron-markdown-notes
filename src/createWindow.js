const { BrowserWindow } = require('electron');
const { mainWindow, file } = require('./conf/browser');

const windowContainer = new Set()

const createWindow = () => {
    let x, y;
    const currentWindow = BrowserWindow.getFocusedWindow();

    if(currentWindow) {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition();

        x = currentWindowX + 60;
        y = currentWindowY + 100;
    }

    const win = exports.win = mainWindow(x, y)
    win.loadURL(file);
    win.once('ready-to-show', () => {
        win.show();
        win.webContents.openDevTools();
        // getFileFromUser();
    });

    win.on('closed', () => {
        windowContainer.delete(win);

        delete win;
    })

    windowContainer.add(win);

    return win;
}

module.exports = {
    createWindow
}