import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message, WebSocketErrorMessage, WebSocketNotification } from '../models/message.model';
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketConnectionService {

  private webSocketAddress:string = "ws://localhost:8999/?id=";

  private socket$: WebSocketSubject<any>;
  private socketSubscription: Subscription;

  newMessageEvent = new Subject<Message>();
  newWebsocketNotification = new Subject<WebSocketNotification>();

  constructor(private authService: AuthService) {
  }

  openConnection(id: string) {
    this.socket$ = new WebSocketSubject(this.webSocketAddress + id);
    this.socketSubscription = this.socket$.subscribe( 
        (message) => { this.handleMessage(message) },
        (err) => { console.error(err); },
        () => { console.warn('Completed!') }
    )
  }

  sendMessage(body:string, toEntireChat:boolean, recipientId?:string){
    if(toEntireChat==false && (recipientId==undefined || recipientId=="" || recipientId==null)) { 
      console.error("You must specify a recipient if you don't want to send this message to the Entire Chat.");
      return;
    }
    if(this.authService.isLoggedIn()){
      let message: Message = { 
        body: body,
        sender: this.authService.getUserId(),
        toEntireChat: toEntireChat,
        recipientId: recipientId
      }
      console.log("sending this message: ", message);
      this.socket$.next(JSON.stringify(message));
    }
  }
  
  handleMessage(message: any ) {
    
    if (message.Response) {
      message = message as WebSocketNotification
      this.newWebsocketNotification.next(message);

    } else if (message.body){
      message = message as Message
      this.newMessageEvent.next(message);

    } else if (message.Error) {

      message = message as WebSocketErrorMessage
      
    }
  }

}
