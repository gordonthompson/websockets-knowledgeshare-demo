export class Message {
    body: string;
    sender: string;
    toEntireChat: boolean;
    recipientId?: string;
}

export class WebSocketNotification {
    Response: string
}

export class WebSocketErrorMessage {
    Error: string
}

var exampleMessages: (Message|WebSocketNotification)[] = [
  {
    body: "First message",
    sender: "Eduardo",
    toEntireChat: true,
  },
  {
    Response: "You joined"
  },
  {
    body: "SEcond message",
    sender: "Eduardo",
    toEntireChat: false,
    recipientId: "My ID",
  },
  {
    Response: "You joined"
  },
  {
    body: "ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message",
    sender: "Eduardo",
    toEntireChat: true,
  },
  {
    Response: "You joined"
  },
  {
    body: "First message",
    sender: "Eduardo",
    toEntireChat: false,
    recipientId: "My ID",
  },
  {
    Response: "You joined"
  },
  {
    body: "ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message ThirdTHira message",
    sender: "Eduardo",
    toEntireChat: true,
  }
]