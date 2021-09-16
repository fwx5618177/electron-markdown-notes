const { BrowserWindow } = require('electron');
const path = require('path');

// const file = path.join(__dirname, 'public/index.html')
const file = `http://localhost:${process.env.npm_package_config_port}/`
const browserConf = {
    width: 600,
    height: 800,
    show: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }
}

const mainWindow = (x, y) => new BrowserWindow({x, y, ...browserConf});

module.exports = {
    mainWindow,
    file
}