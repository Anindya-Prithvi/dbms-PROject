import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logincreds = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')]),
    password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')])
  })

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.logincreds.value);
    //use login endpoint
    axios.get('/register').then(response => {
      console.log(response);
    })
  }

}
