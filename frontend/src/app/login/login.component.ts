import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  logincreds = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\.]+')]),
    password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\. -]+')])
  })

  @Input()
  logintype: string | undefined = undefined;

  constructor() {

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.logincreds.value);
    //use login endpoint
    axios.post('/api/v1/' + (this.logintype === 'user' ? 'login' : 'managerlogin'), this.logincreds.value).then(response => {
      console.log(response.data);
      console.log(response);

      // localStorage.setItem('accesscookie', response.data);
      // if (response.data === "correct") { sessionStorage.setItem('login', 'true') };
      if (response.data === "correct") {
        window.location.reload(); //comment out at debugging        
      }
      else {
        window.alert(`No hacking xD`);
      }
    })
  }

}
