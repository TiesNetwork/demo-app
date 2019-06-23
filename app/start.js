const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

const menu = require('./menu');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 720,
    icon: path.join(__dirname, './../build/icon-oasis.icns'),
    title: 'Oasis',
    width: 1280,
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, './../build/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
  );

  isDev && mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
};

app.on('activate', () => mainWindow === null && createWindow());
app.on('ready', async () => {
  createWindow();
  // eslint-disable-next-line
  require(path.join(__dirname, './../build/server/start.js'));
  // childProcess.exec('yarn start:server');
});
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

ipcMain.on('reload', event => mainWindow && mainWindow.reload());