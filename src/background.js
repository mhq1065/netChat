import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
let ipcMain = require("electron").ipcMain;
const { dialog } = require("electron");
const Store = require('electron-store');

Store.initRenderer();

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 500,
        minHeight: 500,
        frame: false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true
            // nodeIntegration: true,
        },
    });
    // 接收进程间通信
    //接收最小化命令
    ipcMain.on("window-min", function () {
        win.minimize();
    });
    //接收最大化命令
    ipcMain.on("window-max", function () {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    });
    //接收关闭命令
    ipcMain.on("window-close", function () {
        win.close();
    });
    //接受获取文件命令

    ipcMain.on("getlocalfile", function (event, arg) {
        win.focus();
        const res = dialog.showOpenDialogSync({
            title: "对话框窗口的标题",
            defaultPath: "", // 打开文件选择器的哪个路径 需要输入一个有效路径
            buttonLabel: "确认按钮文案",
            // 限制能够选择的文件为某些类型
            filters: [
                // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
                // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
                // { name: 'Custom File Type', extensions: ['as'] },
                // { name: 'All Files', extensions: ['*'] },
            ],
            nameFieldLabel: "替换文件", // “文件名”文本字段前面显示的文本自定义标签
            showsTagField: true, // 显示标签输入框，默认值为true
            properties: ["showHiddenFiles"],
            message: "mac文件选择器title",
        });
        event.sender.send('getlocalfile-reply', res)
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.commandLine.appendSwitch('disable-features','OutOfBlinkCors');


app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    // if (isDevelopment && !process.env.IS_TEST) {
    //   // Install Vue Devtools
    //   try {
    //     await installExtension(VUEJS_DEVTOOLS)
    //   } catch (e) {
    //     console.error('Vue Devtools failed to install:', e.toString())
    //   }
    // }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
