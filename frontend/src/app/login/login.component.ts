import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  csx: CookieService;
  logincreds = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')]),
    password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')])
  })

  constructor(csx: CookieService) {
    this.csx = csx;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.logincreds.value);
    //use login endpoint
    axios.post('/login', this.logincreds.value).then(response => {
      console.log(response.data);
      localStorage.setItem('accesscookie', response.data);
      this.csx.set('accesscookie', response.data);
      window.location.reload();
    })
  }

}
