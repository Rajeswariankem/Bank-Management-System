import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow;

const createWindow = async () => {

    console.log("Creating Electron window...");

    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        show: true,
        backgroundColor: "#f1f5f9",

        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.webContents.on("did-finish-load", () => {
        console.log("Electron page finished loading.");
    });

    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
        console.error("Electron failed to load:");
        console.error("Error code:", errorCode);
        console.error("Description:", errorDescription);
        console.error("URL:", validatedURL);
    });

    if (isDev) {

        console.log("Loading development URL...");

        await mainWindow.loadURL("http://localhost:5173");

        mainWindow.webContents.openDevTools();

    } else {

        console.log("Loading production build...");

        await mainWindow.loadFile(
            path.join(__dirname, "../dist/index.html")
        );
    }
};

app.whenReady().then(() => {

    console.log("Electron application started.");
    console.log("User data path:", app.getPath("userData"));

    createWindow();

    app.on("activate", () => {

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }

    });
});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});