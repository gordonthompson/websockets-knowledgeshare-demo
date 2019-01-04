
/**
 * 1. Import all required modules.
 */

const express = require('express');
const http = require('http');
const webSocket = require('ws');
const url = require('url');


/**
 * 2. Initialize the Websocket Server
 */

const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({ server });
var CLIENTS = [];



/**
 * 3. Define the listener for when a new connection is formed. 
 */
wss.on('connection', (ws, req) => {
    
    /**
     * A. Extract the ID from Query Param & record the new connection.
     */

    let id = url.parse(req.url, true).query.id;

    if(id==undefined){
        closeConnection(ws);
        return;
    }
    
    const client = { id: id, socket: ws };
    CLIENTS.push(client);


    /**
     * B. Send Confirmation to the client who just joined & log it in the Websocket's console.
     */
    console.log(`New connection - id=${id}; CLIENTS.length = ${CLIENTS.length};`);
    ws.send(`{"Response":"You are now connected to the Websocket. Your id is ${id}. There are ${CLIENTS.length} clients connected : ${CLIENTS.map((x)=>x.id+" ")}"}`);
    notifyMembers(id=id, joined=true, left=false);


    /**
     * C. Define the listener for when a client sends a message. 
     */
    ws.on('message', (message) => {
        
        // I. Log it.
        console.log(`Message received from ${getClientByWs(ws).id}`);

        // II. Send a receipt
        let _receipt = { "response": `Server has received your message - ${message}`};
        if(ws.OPEN){
            ws.send(JSON.stringify(_receipt));
        } else { 
            console.log(`Websocket ${getClientByWs(ws).id} is not open to send the receipt.`)
        }

        // III. Send to intended recipient
        sendToRecipient(message, ws);
    });

    
    /**
     * D. Define the listener for when an error is found.
     */
    ws.on('error', (event) => {
        console.log(`An error has been found.`);
        logger.debug(event.err + ` state: ` + ws.readyState);
    });

    
    /**
     * E. Define the listener for when the client closes their Websocket Connection.
     */
    ws.on('close', (user) => {
        /**
         * -I. Set-up
         */
        let _index = CLIENTS.findIndex( (client) => client.socket == ws);
        if(_index == -1) {
            console.error(`Websocket couldn't be removed because it wasn't found.`);
            return;
        }
        let _inl_client_size = CLIENTS.length;
        let _droppedClientId = getClientByWs(ws).id;

        /**
         * I. Remove the client from the CLIENTS array
         */
        CLIENTS = CLIENTS.slice(0, _index).concat(CLIENTS.slice(_index+1));

        /**
         * II. Log the message in the Websocket's console.
         */
        console.log(`Dropped Connection - ${_droppedClientId} CLIENTS.length ${_inl_client_size} -> ${CLIENTS.length} `);

        /**
         * III. Ensure the connection is clsoed.
         */
        closeConnection(ws);
        notifyMembers(_droppedClientId, joined=false, left=true);
    });
});

/**
 * 4. Start the server
 */
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});

/**
 * 5. Define the helper functions
 */

function getClientByWs(ws){
    return CLIENTS[CLIENTS.findIndex( (client) => client.socket == ws)];
}

function closeConnection(ws){
    ws.close();
    ws._socket.destroy();
    return;
}

function sendToRecipient(message, sender){
    try {
        var msg = JSON.parse(message);
    } catch(err){
        console.error(`ERROR: Payload isn't a JSON`);
        let error = {
            "Error":"Invalid body format. Unable to convert it to JSON."
        }
        sender.send(JSON.stringify(error));
        return;
    }

    // Quirk of JSON.parse... Must be done twice sometimes.
    if(typeof(msg)=='string'){
        msg = JSON.parse(msg);
    }
    
    if(msg.toEntireChat) {

        if(msg.recipientId) {
            console.error(`ERROR: Contradictory Responses; toEntireChat & recipientId fields are mutually exclusive.`);
            let error = {
                "Error":"Contradictory Responses; toEntireChat & recipientId fields are mutually exclusive."
            }
            sender.send(JSON.stringify(error));
            return;
        }
        CLIENTS.forEach( (_client, index) => {
            try {
                _client.socket.send(JSON.stringify(msg));
            } catch (error) { 
                console.error(`Error found sending to recipient #${index}: ${error}`);
            }
        })
    }
    else {
        let _recipient = msg.recipientId;
        if( (_recipient == undefined) || (_recipient == '') || (_recipient == null) ) {
            console.error(`ERROR: No recipient indicated`);
            let error = {
                "Error":"Invalid body format. No recipient indicated."
            }
            sender.send(JSON.stringify(error));
            return;
        }

        CLIENTS.forEach( (_client, index) => {
            if(_client.id == _recipient) {
                try {
                    _client.socket.send(JSON.stringify(msg));
                } catch (error) { 
                    console.error(`Error found sending to recipient #${index}: ${error}`);
                }
            }
        })
    }
}


function notifyMembers(id, joined=false, left=false){
    if(joined){
        CLIENTS.forEach( (_client, index) => {
            if(_client.id != id) {
                try {
                    _client.socket.send(`{"Response":"${id} has just joined the Websocket. There are now ${CLIENTS.length} clients connected."}`);
                } catch (error) { 
                    console.error(`Error found sending to recipient #${index}: ${error}`);
                }
            }
        })
    } else if (left) {
        CLIENTS.forEach( (_client, index) => {
            if(_client.id != id) {
                try {
                    _client.socket.send(`{"Response":"${id} has just left the Websocket. There are now ${CLIENTS.length} clients connected."}`);
                } catch (error) { 
                    console.error(`Error found sending to recipient #${index}: ${error}`);
                }
            }
        })
    }

}