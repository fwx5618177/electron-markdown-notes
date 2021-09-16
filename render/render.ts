const marked = require('marked');
const { ipcRenderer } = require('electron')
const remote = require('@electron/remote');
const { getFileFromUser } = remote.require('../src/lib/dialog');
const { createWindow } = remote.require('../src/createWindow');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

let filePath: string | null = null;
let originalContent: string = '';
const currentWindow = remote.getCurrentWindow()

const renderMarkdownToHtml = (markdown: any) => {
    (htmlView as Element).innerHTML = marked(markdown, { sanitize: true });
};

(markdownView as Element).addEventListener('keyup', (event: Event) => {
     // @ts-ignore
    const currentContent = (event as Event)?.target.value;

    renderMarkdownToHtml(currentContent);
});

(openFileButton as Element).addEventListener('click', () => {
    getFileFromUser(currentWindow);
})

ipcRenderer.on('file-opened', (event: any, file: any, content: any) => {
    console.log('receive:', event, file)
    // @ts-ignore
    markdownView?.value = content;
    renderMarkdownToHtml(content);
})

newFileButton?.addEventListener('click', () => {
    createWindow();
})