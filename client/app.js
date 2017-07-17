console.time('init')

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const ipcMain = electron.ipcMain

const fs = require('fs');

const path = require('path')
const url = require('url')
const http = require('http');

function makeLoadRequest(host, path, cb1 = () => {}, cb2 = () => {}) {
    var callback = function(response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            cb1(str)
        });
    }
    var req = http.request({host: host, path: path}, callback)
    req.on('error', () => {
        cb2()
    });
    req.end();
}

function send(to, percentage, message) {
    to.webContents.send('loadEvent', {percent: percentage, msg: message})
}

function createLogin () {
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
        if (data.username == 'natetc95' && data.password == 'password123') {
            console.log('ayy')
            e.sender.send('loginresponse', {allowed: true})
        } else {
            e.sender.send('loginresponse', {allowed: false})
        }
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('remember', {u: 'natetc95', p: 'password123', r: true});
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
        createLogin()
    })
    mainWindow.webContents.on('did-finish-load', () => {
        makeLoadRequest('www.google.com', '', (str) => {
            send(mainWindow, 50, 'Success contacting Google!')
        }, () => {
            send(mainWindow, 50, 'Error contacting Google!')
        })
        makeLoadRequest('www.nodejs.org', '', (str) => {
            send(mainWindow, 100, 'Success contacting Node!')
        }, () => {
            console.log('error!')
        })
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

process.on('uncaughtException', function (exp) {
    fs.open('errors.log','a',(err, fd) => {
        fs.writeSync(fd, '[' + Date.now() + '] ' + exp + '\n');
    })
}); 