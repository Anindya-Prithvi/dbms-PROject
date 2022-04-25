import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-saving-passbook-send-money-credit-card',
  templateUrl: './saving-passbook-send-money-credit-card.component.html',
  styleUrls: ['./saving-passbook-send-money-credit-card.component.css']
})
export class SavingPassbookSendMoneyCreditCardComponent implements OnInit {

  cardNo = "xxxx xxxx xxxx 1234";
  expiry = "xx/xx";
  name = "Vibster";


  transactionCreds = new FormGroup({
    toAccount: new FormControl('', [Validators.required]),
    toAccountType: new FormControl('', [Validators.required]),
    cvv: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required])
  })

  @Input()
  logintype: string | undefined = undefined; 


  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.transactionCreds.value);
    //use login endpoint
    axios.post('/api/v1/' + (this.logintype === 'user' ? 'login' : 'managerlogin'), this.transactionCreds.value).then(response => {
      console.log(response.data);
      console.log(response);

      // localStorage.setItem('accesscookie', response.data);
      // if (response.data === "correct") { sessionStorage.setItem('login', 'true') };
      // window.location.reload(); //comment out at debugging
    })
  }

}
