# KnowledgeShare Websocket Demo

## Introduction

This repository holds the code that was used to demo Websockets in the January 4th Knowledge Share. It is a low-fi build of a Chatroom which proves out:
- the ability of a Front End client to use Websockets to be notified by the server of relevant events & update the DOM accordingly, with less overhead computational expenses
- server-side Websocket filtering of messages: only the intended recipients are notified of messages
- exposing a REST API to a Websocket for simpler 3rd-party integrations

## Dependencies

The demo uses Node v10.5.0 and NPM v.6.4.1

The demo also uses `ngrok` which tunnels the port at which our Websocket lives so it can be exposed to the demo attendees. This requires an extra set-up step & allows you to expose a port on your localhost, but it is purely optional. To disable it, simply replace the `ngrok` link with a link to `localhost:8999` to connect. You can download it [here](https://ngrok.com/).

## Installation

1. Clone the repository onto your machine
2. If you wish to use `ngrok` to tunnel your local machine's port through ngrok's server, then make sure to download ngrok.
3. Via your terminal, `cd` into `websocket` & run `npm install & node websocket.js`. This will run the websocket code on your port 8999.
4. (OPTIONAL) If you want to use `ngrok` then, from the directory where you have ngrok downloaded, run `./ngrok http 8999`. Then go to Line 14 of `websocket-connection.service.ts` and replace the `localhost:8999` of the `webSocketAddress` variable with the URL obtained from NgROK. For example, it can be set to: `wss://1dc1d163.ngrok.io/?id=`
5. To start the app, from `app/websocketdemo`: `npm install & npm start`
6. To start the REST API, from `REST_API`: `npm install & node api.js`


## Demo Flow

Once each of the 3 projects are running (the Websocket, the App, and the API), open multiple windows on your favorite browser to the App at `localhost:4200` - each will represent a different chatbot user. Enter a different userName for each and then send messages from each account. If the recipient field is blank, the message will be sent to the channel. Observe the other windows be updated rapidly with the information that is intended for them. 

Now imagine we want to expose a REST API to this chatroom, so 3rd party consumers can send messages without needing to go through our interface or create their own Websocket connection. That is precisely what our API offers. By sending the following payload attached to a POST request to `localhost:3000`, which is the port the API is running on, this 3rd party can achieve this. The API itself maintains a Websocket connection to the Websocket & simply forwards the request payload.
```
{
	"body": "Hellooooo",
	"sender": "Hi",
	"toEntireChat": false,
	"recipientId": "Yichi"
}
```

## Further Resources

https://www.youtube.com/watch?v=vQjiN8Qgs3c

https://www.youtube.com/watch?v=FmaBZcQzL-Y&t=67s

https://www.youtube.com/watch?v=i5OVcTdt_OU