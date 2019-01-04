
/**
 * 1. Import all required modules.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

/**
 * 2. Initialize the API server & the websocket connection
 */

var connection;
const port = 3000
const base_url = "ws://localhost:8999/"
const id = "api"
const ws_address = `${base_url}?id=${id}`

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

const WebSocketClient = require("websocket").client;
const client = new WebSocketClient();


/**
 * 3. Expose '' POST Endpoint which will validate payload, format it & then send it to websocket
 */

app.post('', (req, res) => {
    let body = req.body;

    if(body == null || body == {}) {
        res.status(400).json({ message: "Body is empty." });
        return;
    } else if(['body', 'sender', 'toEntireChat'].map( (x)=>req.body[x]).indexOf(undefined)!=-1){
        res.status(400).json({ message: "Body has wrong format." });
        return;
    }

    var formatted_body = {
        body: body.body,
        sender: body.sender,
        toEntireChat: body.toEntireChat,
        recipientId: body.recipientId
    };

    sendMessageToWs(JSON.stringify(formatted_body));

    res.status(200).send("Message sent to the Websocket.");
});

/**
 * 4. Define Websocket listeners
 */

client.on('connectFailed', function(error) {
    console.log("Connect Error: " + error.toString());
});

client.on('connect', function(_connection) {
    console.log('WebSocket Client connected');
    connection = _connection;

    _connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    _connection.on('close', function() {
        console.log('Connection Closed');
    });

    _connection.on('message', function(message) {
        if(message.type=='utf-8') {
            console.log("Received message: '"+message.utf8Data + "'");
        }
    });
})


/**
 * 5. Start API & the Websocket Listener.
 */

app.listen(port, () => {
    console.log(`API began listening on port ${port}!`);
    client.connect(ws_address);
})


/**
 * 6. Helper Functions.
 */

function sendMessageToWs(msg){
    if(connection.connected) {
        connection.send(JSON.stringify(msg));
    }
}