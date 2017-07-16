console.time('init')

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

function createWindow () {
    var mainWindow = new BrowserWindow(
    {
        width: 280, 
        height: 300,
        transparent: true,
        frame: false,
        resizable: false,
        icon: 'images/prometheus.png',
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    ipcMain.on('loginrequest', function(e, data) {
        console.log(data)
        e.sender.send('loginresponse', {allowed: false})
    });

}

function initialize() {
    ipcMain.once('initcomplete', function(e) {
        console.timeEnd('init')
    });
    createWindow()
}

app.on('ready', initialize)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})