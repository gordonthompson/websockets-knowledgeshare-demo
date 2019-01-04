import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { WebsocketConnectionService } from './services/websocket-connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn: boolean = false;
  id: string;

  authSub:Subscription;
  newMessageSub: Subscription;

  constructor(private authService: AuthService, private websocketConnectionService: WebsocketConnectionService) {}

  ngOnInit() {
    this.authSub = this.authService.changeAuthEvent
      .subscribe( (_loggedIn:boolean) => {
        console.log("_loggedIn listener changed from ", this.loggedIn," to ", _loggedIn)
        this.loggedIn = _loggedIn;
        this.websocketConnectionService.openConnection(this.authService.getUserId());
      }
    )
  }

}
