let electron = require('electron');
let { remote, ipcRenderer: ipc } = electron;
var tmi = require('tmi.js');
var YouTube = require('youtube-live-chat');
var fs = require('fs');
let data = JSON.parse(decodeURI(window.location.hash.substr(1)));
var osu = require('node-osu'),
    api = new osu.Api(data.osu, {
        notFoundAsError: false
    });
var request = require('request');
var readline = require('readline');
var ojsama = require('ojsama');
let reqlids = [];
let requests = [];
let requsers = [];
var RegExps = [
    /https?:\/\/osu\.ppy\.sh\/b\/[1|2|3|4|5|6|7|8|9|0]*/i,
    /https?:\/\/osu\.ppy\.sh\/beatmapsets\/[1|2|3|4|5|6|7|8|9|0]*#\w*\/[1|2|3|4|5|6|7|8|9|0]*/i
];
let lid = 0;
var options;
var client;
if(data.tch) {
    var options = Object.assign({
        "options": {
            "debug": false
        },
        "connection": {
            "cluster": "aws",
            "reconnect": true
        }
    }, {channels: [data.tch], identity: {username: data.tch, password: data.ttoken}});
    var client = new tmi.client(options);
    client.connect();
    client.on('message', (channel, user, msg, self) => {
        if(data.prefix ? msg.startsWith(data.prefix) : true) {
            RegExps.forEach((regexp, ind) => {
                let search = {};
                let match = msg.match(regexp);
                if(!match) return;
                let id = match[0].split('/').pop();
                search.b = id
                api.getBeatmaps(search).then(bms => {
                    if(!bms[0]) return;
                    if(requests.indexOf(bms[0].id) != -1) {
                        if(requsers[requests.indexOf(bms[0].id)].indexOf(user['user-id']) == -1) {
                            requsers[requests.indexOf(bms[0].id)].push(user['user-id']);
                            ipc.sendSync('add', {id: reqlids[requests.indexOf(bms[0].id)], index: requests.indexOf(bms[0].id), c: requsers[requests.indexOf(bms[0].id)].length});
                        }
                        return;
                    }
                    request.get(`https://osu.ppy.sh/osu/${bms[0].id}`, function(err, res, body) {
                        let div = document.createElement('div');
                        div.classList.add('request');
                        lid++;
                        div.id = String(lid);
                        if(bms[0].mode == 'Standard') {
                            fs.writeFileSync(`./cache${bms[0].id}.osu`, body);
                            var parser = new ojsama.parser();
                            readline.createInterface({
                                input: fs.createReadStream(`./cache${bms[0].id}.osu`)
                            }).on("line", parser.feed_line.bind(parser))
                            .on("close", () => {
                                var map = parser.map;
                                var stars = new ojsama.diff().calc({map: map, mods: 0});
                                var pp95 = ojsama.ppv2({
                                    stars: stars,
                                    combo: map.max_combo(),
                                    nmiss: 0,
                                    acc_percent: 95
                                }).total.toFixed(2);
                                var pp100 = ojsama.ppv2({
                                    stars: stars,
                                    combo: map.max_combo(),
                                    nmiss: 0,
                                    acc_percent: 100
                                }).total.toFixed(2);
                                div.innerHTML = `<img src="https://assets.ppy.sh/beatmaps/${bms[0].beatmapSetId}/covers/list@2x.jpg" width="160"><span class="request-title">${bms[0].artist} - ${bms[0].title}</span>
                                <span class="request-diff">[${bms[0].version}] AR${bms[0].difficulty.approach} CS${bms[0].difficulty.size} OD${bms[0].difficulty.overall} <span title="95%/100% FC PP">PP(${pp95}/${pp100})</span></span>
                                <span class="request-creator">by ${bms[0].creator}</span>
                                <div class="request-buttons"><i class="fas fa-download" title="Download mapset (osu!direct)" onclick="download('${bms[0].beatmapSetId}')"></i><i class="fas fa-trash" title="Remove request" onclick="remove('${lid}', '${bms[0].id}')"></i></div>`;
                                document.body.appendChild(div);
                                fs.unlinkSync(`./cache${bms[0].id}.osu`);
                                ipc.sendSync('requ', {bm: bms[0], id: lid, c: 1});
                                requests.push(bms[0].id);
                                requsers.push([user['user-id']]);
                                reqlids.push(lid);
                            })
                        } else {
                            div.innerHTML = `<img src="https://assets.ppy.sh/beatmaps/${bms[0].beatmapSetId}/covers/list@2x.jpg" width="160"><span class="request-title">${bms[0].artist} - ${bms[0].title}</span>
                            <span class="request-diff">[${bms[0].version}] AR${bms[0].difficulty.approach} CS${bms[0].difficulty.size} OD${bms[0].difficulty.overall}</span>
                            <span class="request-creator">by ${bms[0].creator}</span>
                            <div class="request-buttons"><i class="fas fa-download" title="Download mapset (osu!direct)" onclick="download('${bms[0].beatmapSetId}')"></i><i class="fas fa-trash" title="Remove request" onclick="remove('${lid}', '${bms[0].id}')"></i></div>`;
                            document.body.appendChild(div);
                            ipc.sendSync('requ', {bm: bms[0], id: lid, c: 1});
                            requests.push(bms[0].id);
                            requsers.push([user['user-id']]);
                            reqlids.push(lid);
                        }
                    })
                })
            })
        }
    })
}

var yt;
if(data.ych) {
    yt = new YouTube(data.ych, data.ytoken);

    yt.on('ready', () => {
        yt.listen(1000);
    });

    yt.on('message', data => {
        let msg = data.snippet.displayMessage;
        let user = data.snippet.authorChannelId;
        if(data.prefix ? msg.startsWith(data.prefix) : true) {
            RegExps.forEach((regexp, ind) => {
                let search = {};
                let match = msg.match(regexp);
                if(!match) return;
                let id = match[0].split('/').pop();
                search.b = id;
                api.getBeatmaps(search).then(bms => {
                    if(!bms[0]) return;
                    if(requests.indexOf(bms[0].id) != -1) {
                        if(requsers[requests.indexOf(bms[0].id)].indexOf(user) == -1) {
                            requsets[requests.indexOf(bms[0].id)].push(user);
                            ipc.sendSync('add', {id: reqlids[requests.indexOf(bms[0].id)], index: requests.indexOf(bms[0].id), c: requests[requests.indexOf(bms[0].id)].length});
                        }
                        return;
                    }
                    request.get(`https://osu.ppy.sh/osu/${bms[0].id}`, function(err, res, body) {
                        let div = document.createElement('div');
                        div.classList.add('request');
                        lid++;
                        div.id = String(lid);
                        if(bms[0].mode == 'Standard') {
                            fs.writeFileSync(`./cache${bms[0].id}.osu`, body);
                            var parser = new ojsama.parser();
                            readline.createInterface({
                                input: fs.createReadStream(`./cache${bms[0].id}.osu`)
                            }).on("line", parser.feed_line.bind(parser))
                            .on("close", () => {
                                var map = parser.map;
                                var stars = new ojsama.diff().calc({map: map, mods: 0});
                                var pp95 = ojsama.ppv2({
                                    stars: stars,
                                    combo: map.max_combo(),
                                    nmiss: 0,
                                    acc_percent: 95
                                }).total.toFixed(2);
                                var pp100 = ojsama.ppv2({
                                    stars: stars,
                                    combo: map.max_combo(),
                                    nmiss: 0,
                                    acc_percent: 100
                                }).total.toFixed(2);
                                div.innerHTML = `<img src="https://assets.ppy.sh/beatmaps/${bms[0].beatmapSetId}/covers/list@2x.jpg" width="160"><span class="request-title">${bms[0].artist} - ${bms[0].title}</span>
                                <span class="request-diff">[${bms[0].version}] AR${bms[0].difficulty.approach} CS${bms[0].difficulty.size} OD${bms[0].difficulty.overall} <span title="95%/100% FC PP">PP(${pp95}/${pp100})</span></span>
                                <span class="request-creator">by ${bms[0].creator}</span>
                                <div class="request-buttons"><i class="fas fa-download" title="Download mapset (osu!direct)" onclick="download('${bms[0].beatmapSetId}')"></i><i class="fas fa-trash" title="Remove request" onclick="remove('${lid}', '${bms[0].id}')"></i></div>`;
                                document.body.appendChild(div);
                                fs.unlinkSync(`./cache${bms[0].id}.osu`);
                                ipc.sendSync('requ', {bm: bms[0], id: lid, c: 1});
                                requests.push(bms[0].id);
                                requsers.push([user['user-id']]);
                                reqlids.push(lid);
                            })
                        } else {
                            div.innerHTML = `<img src="https://assets.ppy.sh/beatmaps/${bms[0].beatmapSetId}/covers/list@2x.jpg" width="160"><span class="request-title">${bms[0].artist} - ${bms[0].title}</span>
                            <span class="request-diff">[${bms[0].version}] AR${bms[0].difficulty.approach} CS${bms[0].difficulty.size} OD${bms[0].difficulty.overall}</span>
                            <span class="request-creator">by ${bms[0].creator}</span>
                            <div class="request-buttons"><i class="fas fa-download" title="Download mapset (osu!direct)" onclick="download('${bms[0].beatmapSetId}')"></i><i class="fas fa-trash" title="Remove request" onclick="remove('${lid}', '${bms[0].id}')"></i></div>`;
                            document.body.appendChild(div);
                            ipc.sendSync('requ', {bm: bms[0], id: lid, c: 1});
                            requests.push(bms[0].id);
                            requsers.push([user['user-id']]);
                            reqlids.push(lid);
                        }
                    });
                });
            });
        }
    });

    yt.on('error', error => {
        if(error == 'Can not load live.' || error == 'Can not find chat.') setTimeout(() => yt.getLive(), 10000);
    });
}

function remove(id, bm) {
    requsers.splice(requests.indexOf(bm), 1);
    reqlids.splice(requests.indexOf(bm), 1);
    requests.splice(requests.indexOf(bm), 1);
    document.getElementById(id).remove();
    ipc.sendSync('remo', id);
}

function download(id) {
    remote.shell.openExternal(`osu://dl/${id}`);
}