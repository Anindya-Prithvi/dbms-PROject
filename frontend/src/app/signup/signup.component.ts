import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  //   {
  //     "empID": 1337,
  //     "employee_password": "QDoJGFlWQiY",
  //     "user_password": "12345",
  //     "pan": "ABCDE1191J",
  //     "customerName": "Ultra PRO",
  //     "address_flatno": 10,
  //     "address_locality": "Jamaica",
  //     "address_state": "Solid",
  //     "address_country": "Russia",
  //     "phone_countryCode": 909,
  //     "phone_number": 9930911109,
  //     "username": "ultrprodguy1"
  // }
  registrationcreds = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\.]+')]),
    user_password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\. -]+')]),
    empID: new FormControl('', Validators.pattern('[0-9]+')),
    employee_password: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\. -]+')]),
    pan: new FormControl('', Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]')),
    customerName: new FormControl('', [Validators.pattern('[A-Za-z ]+'), Validators.maxLength(100)]),
    address_flatno: new FormControl('', Validators.pattern('[0-9]+')),
    address_locality: new FormControl('', Validators.pattern('[A-Za-z ]+')),
    address_state: new FormControl('', Validators.pattern('[A-Za-z ]+')),
    address_country: new FormControl('', Validators.pattern('[A-Za-z ]+')),
    phone_number: new FormControl('', Validators.pattern('[0-9]{10}')),
    phone_countryCode: new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(3)])
  })

  constructor() {

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.registrationcreds.value);
    //use login endpoint
    axios.post('/api/v1/register', this.registrationcreds.value).then(response => {
      console.log(response.data);
      console.log(response);

      // localStorage.setItem('accesscookie', response.data);
      // if (response.data === "correct") { sessionStorage.setItem('login', 'true') };
      if (response.data === "Success") {
        window.alert("Congrats! You are registered");
        window.location.reload(); //comment out at debugging        
      }
      else {
        window.alert(`Error occured: ${response.data}`);
      }

    })
  }

}
