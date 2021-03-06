var socket = io();

var reqs = [];

async function freezeForever() {
    return new Promise();
}

async function json() {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState != 4) return;
            
            if(this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else {
                reject(false);
            }
        }
        xhr.open("GET", "http://localhost:{port}/data", true);
        xhr.send();
    })
}

function updateList() {
    reqs.forEach((req, ind) => {
        document.getElementById(req).style.cssText = `transform: translateY(${95*ind}px)`;
    })
}

function addReq(req) {
    let div = document.createElement('div');
    div.classList.add('request');
    div.classList.add('hd');
    div.id = String(req.id);
    div.innerHTML = `<img src="https://assets.ppy.sh/beatmaps/${req.bm.beatmapSetId}/covers/list@2x.jpg" height="80"><span class="request-title">${req.bm.artist} - ${req.bm.title}</span><span class="request-creator">by ${req.bm.creator}</span><span class="request-count" id="c${req.id}">${req.c} ${req.c>1 ? "requests" : "request"}</span>`;
    document.getElementById('requests').appendChild(div);
    reqs.push(String(req.id));
    setTimeout(() => {
        document.getElementById(String(req.id)).classList.remove('hd');
    }, 100);
    updateList();
}

function remReq(id) {
    document.getElementById(id).classList.add('rem');
    setTimeout(document.getElementById(id).remove(), 550);
    reqs.splice(reqs.indexOf(id), 1);
    updateList();
}

function updateCount(data) {
    document.getElementById(`c${data.id}`).innerHTML = `${data.c} requests`;
}

async function start() {
    let requests = await json();
    console.log(requests);
    requests.forEach(req => {addReq(req)});

    socket.on('requ', (req) => {addReq(req);});

    socket.on('remo', (id) => {remReq(id);})

    socket.on('add', (data) => {updateCount(data)})
}