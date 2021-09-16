const { dialog, webContents } = require('electron');
const fs = require('fs');

const getFileFromUser = (targetWindow) => {
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            // { name: 'Text Files', extensions: ['txt'] },
            // { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
    });

    if(!files)  return;

    files
    .then(data => {
        const { canceled, filePaths } = data;
        if(canceled)    return;

        const fi = filePaths[0];
                 
        openFiles(targetWindow, fi);
    })
    .catch(err => console.log(err));
}

// 多窗口传递数据
const openFiles = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();
    targetWindow.webContents.send('file-opened', file, content);
}

module.exports = {
    getFileFromUser
}