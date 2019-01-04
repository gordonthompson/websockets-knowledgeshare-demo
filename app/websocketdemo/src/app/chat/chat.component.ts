import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketConnectionService } from '../services/websocket-connection.service';
import { Message, WebSocketNotification } from '../models/message.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  newMessageSub: Subscription;
  newNotificationSub: Subscription;
  messages: (Message|WebSocketNotification)[] = [];

  @ViewChild('f') signupForm: NgForm;
  @ViewChild('chatContainer') private scrollableChatHistory: ElementRef;
  
  constructor(private websocketConnectionService: WebsocketConnectionService) {}

  ngOnInit() {
    console.log("Chat is initialized");
    this.scrollToBottom();
    this.newMessageSub = this.websocketConnectionService.newMessageEvent
      .subscribe( (message: Message) => {
        console.log("New Message Received: message = ", message);
        this.messages = this.messages.concat(message);
        this.scrollToBottom();
      });
  
    this.newNotificationSub = this.websocketConnectionService.newWebsocketNotification
      .subscribe( (notification: WebSocketNotification) => {
        console.log("New Notification Received: notification = ", notification)
        this.messages = this.messages.concat(notification);
        this.scrollToBottom();
      });
  }

  sendMessage(){
    let message = this.signupForm.value.message;
    let recipient = this.signupForm.value.recipient;
    let toEntireChat = recipient==''
    this.websocketConnectionService.sendMessage(message, toEntireChat, recipient)
  }

  scrollToBottom(){
    setTimeout( function() {
      this.scrollableChatHistory.nativeElement.scrollTop = this.scrollableChatHistory.nativeElement.scrollHeight;
    }.bind(this), 10);
  }
}
