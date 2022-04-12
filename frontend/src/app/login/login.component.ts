import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logincreds = new FormGroup({})

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("I win");
  }

}
