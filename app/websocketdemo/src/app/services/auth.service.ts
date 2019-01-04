import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;
  private userId: string;

  changeAuthEvent: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  isLoggedIn():boolean {
    return this.loggedIn;
  }

  logIn(userId: string):void{
    this.loggedIn = true;
    this.userId = userId;
    this.changeAuthEvent.next(true);
  }

  logOut():void{
    this.loggedIn = false;
    this.userId = undefined;
    this.changeAuthEvent.next(false);
  }

  getUserId(): string{
    return this.userId;
  }


}
