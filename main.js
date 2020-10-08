const path = require("path");
const electron = require("electron");

const { app, BrowserWindow } = electron;

let mainWindow;

function init() {
  mainWindow = new BrowserWindow({
    title: "Icon Generator",
    icon: path.join(__dirname, "icon.png"),
    width: 600,
    minWidth: 600,
    height: 400,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // dev
  // mainWindow.webContents.openDevTools();
  // load file
  mainWindow.loadFile(path.join(__dirname, "home", "index.html"));
}

app.on("ready", init);
