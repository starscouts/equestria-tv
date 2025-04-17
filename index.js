const { app, BrowserWindow, screen } = require('electron');

let debug = true;
if (process.argv[2] === "prod") {
    debug = false;
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: debug ? 800 : screen.getPrimaryDisplay().size.width,
        height: debug ? 600 : screen.getPrimaryDisplay().size.height,
        fullscreen: debug,
        resizable: debug,
        backgroundColor: "#252525",
        title: "TVApp",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('app/index.html');

    if (!debug) {
        mainWindow.setMenu(null);
        mainWindow.setFullScreen(true);
    }

    //mainWindow.webContents.openDevTools();

    setInterval(() => {
        require('child_process').exec("xdotool mousemove 500 500");
    }, 1000)
}

app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    app.quit();
})