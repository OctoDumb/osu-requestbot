const electron = require('electron');
var { app, BrowserWindow, ipcMain: ipc } = electron;
var express = require('express'),
    ser = express();
ser.use(express.static('public'));
var http = require('http').Server(ser);
var io = require('socket.io')(http);
var fs = require('fs');
const cfg = JSON.parse(fs.readFileSync("./config.json"));

/**
 * @type {BrowserWindow}
 */
let window;

let requests = [];
let requsers = [];

app.on('ready', () => {
    window = new BrowserWindow({width: 700, height: 900, show: false});
    window.setResizable(false);
    window.setFullScreenable(false);
    window.loadFile('requests.html', {hash: JSON.stringify({ch: cfg.channel, token: cfg.token, bot: cfg.bot, prefix: cfg.prefix, osu: cfg.osutoken})});
    window.on('ready-to-show', () => window.show());
});

ipc.on('requ', (event, args) => {
    event.returnValue = true;
    requests.push(args);
    requsers.push(1);
    io.emit('requ', args);
});

ipc.on('remo', (event, args) => {
    event.returnValue = true;
    requests.forEach((req, ind) => {
        if(req.id == args) {
            requests.splice(ind, 1);
            requsers.splice(ind, 1);
        }
    });
    io.emit('remo', args);
});

ipc.on('add', (event, args) => {
    event.returnValue = true;
    io.emit('add', args);
    requsers[args.index]++;
})

app.on('window-all-closed', () => app.exit());

ser.get('/widget', (req, res) => {
    res.send(fs.readFileSync('./widget.html').toString().split("{port}").join(cfg.port));
});

ser.get('/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let data = [];
    requests.forEach((req, ind) => {
        data.push(Object.assign(req, {c: requsers[ind]}));
    })
    res.send(data);
});

http.listen(cfg.port);