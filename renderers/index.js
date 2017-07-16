(function() {
    var remote = require('electron').remote; 
    var BrowserWindow = remote.require('electron').BrowserWindow;
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
            alert('Logon!')
        });

        ipcRenderer.send('initcomplete')

    }; 

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            console.log(document.getElementById("min-btn"))
            init(); 
        }
    };
})();