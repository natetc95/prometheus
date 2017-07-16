(function() {
    var remote = require('electron').remote; 
    var BrowserWindow = remote.require('electron').BrowserWindow;
    var ipcRenderer = require('electron').ipcRenderer;
    var window = BrowserWindow.getFocusedWindow();
    var loadPercent = 0;
    var loadPackage = null;

    function init() { 

        loadPackage = setInterval(function() {
            loadPercent += 1
            document.getElementById('progress').style.width=loadPercent + "%"
            if (loadPercent == 100) {
                clearInterval(loadPackage)
                setTimeout(function() {
                    ipcRenderer.send('done');
                    window.close();
                }, 1000);
            }
        }, 50)
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            console.log(document.getElementById("min-btn"))
            init(); 
        }
    };
})();