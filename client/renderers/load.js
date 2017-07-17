(function() {
    var remote = require('electron').remote; 
    var BrowserWindow = remote.require('electron').BrowserWindow;
    var ipcRenderer = require('electron').ipcRenderer;
    var window = BrowserWindow.getFocusedWindow();

    function init() { 
        document.body.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    };

    ipcRenderer.on('loadEvent', function(e, data) {
        document.getElementById('progress').style.width=data.percent + "%"
        document.getElementById('status').innerHTML = data.msg
        if(data.percent >= 100) {
            setTimeout(() => {
                ipcRenderer.send('done');
                window.close();
            }, 150);
        }
    })

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            console.log(document.getElementById("min-btn"))
            init(); 
        }
    };
})();