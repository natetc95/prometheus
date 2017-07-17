console.time('init')

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')
const http = require('http');

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

function createLoader () {
    var mainWindow = new BrowserWindow({
        width: 410, 
        height: 220,
        transparent: true,
        frame: false,
        resizable: false,
        icon: 'images/prometheus.png',
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/loader.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    ipcMain.once('done', function(e) {
        mainWindow = null
        createWindow()
    })
    function makeLoadRequest(host, path, percentage, message, secondary) {
        var callback = function(response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                mainWindow.webContents.send('loadEvent', {percent: percentage, msg: message})
            });
            secondary();
        }
        http.request({host: host, path: path}, callback).end();
    }
    mainWindow.webContents.on('did-finish-load', () => {
        makeLoadRequest('www.google.com', '', 50, 'Success contacting Google!', () => {})
        makeLoadRequest('www.nodejs.org', '', 99, 'Success contacting Google!', () => {})
    });
}

function initialize() {
    ipcMain.on('initcomplete', function(e) {
        try {
            console.timeEnd('init')
        } 
        catch(err) {
            console.log('The application attempted to complete initialization twice!')
        }
    });
    createLoader()
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