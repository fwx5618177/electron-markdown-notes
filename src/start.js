const { app } = require('electron');

const start = app.whenReady();

module.exports = {
    start,
    app
}