import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {
  @ViewChild('f') signupForm: NgForm;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  createConnection() {
    let id = this.signupForm.value.id;

    if(id==null || id==undefined || id== "") {
      return
    } 
    
    console.log("Log this guy in.");
    this.authService.logIn(id);
  }

}
