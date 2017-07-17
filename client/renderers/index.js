(function() {
    var remote = require('electron').remote; 
    var BrowserWindow = remote.require('electron').BrowserWindow;
    var window = BrowserWindow.getFocusedWindow();
    var ipcRenderer = require('electron').ipcRenderer;

    function init() { 
        document.getElementById("min-btn").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.minimize(); 
        });

        document.getElementById("cls-btn").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });

        document.getElementById('sub').addEventListener("click", function(e) {
            e.preventDefault();
            ipcRenderer.send('loginrequest', {
                username: document.getElementById('uname').value,
                password: document.getElementById('pword').value,
                remember: document.getElementById('remember').checked
            })
        });

        ipcRenderer.send('initcomplete')

    }; 

    ipcRenderer.on('remember', (e, data) => {
        document.getElementById('uname').value = data.u
        document.getElementById('pword').value = data.p
        document.getElementById('remember').checked = data.r
    })

    ipcRenderer.on('loginresponse', (e, data) => {
        if (data.allowed) {
            window.close();
        }
    })

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            console.log(document.getElementById("min-btn"))
            init(); 
        }
    };
})();