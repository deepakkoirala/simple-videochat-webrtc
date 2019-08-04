const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 8080;
const https = require('https');
const fs = require("fs");

const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  // passphrase: ""
};

var server = https.createServer(serverConfig, app).listen(port, () => console.log(`Active on ${port} port`));
const io = require('socket.io')(server)


app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

// http.listen(port, () => console.log(`Active on ${port} port`))



