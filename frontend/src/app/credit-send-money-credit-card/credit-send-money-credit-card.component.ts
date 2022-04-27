import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-credit-send-money-credit-card',
  templateUrl: './credit-send-money-credit-card.component.html',
  styleUrls: ['./credit-send-money-credit-card.component.css']
})
export class CreditSendMoneyCreditCardComponent implements OnInit {
  
  cardNo = "xxxx xxxx xxxx 1234";
  expiry = "xx/xx";
  name = "Vibster";


  transactionCreds = new FormGroup({
    toAccount: new FormControl('', [Validators.required]),
    toAccountType: new FormControl('', [Validators.required]),
    cvv: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required])
  })
  constructor() { 
    let credDetails!: string[];
    axios.get("/api/v1/getCreditCardDetails").then(response => {
      console.log("OYE Credit card hei: " + response.data);
      console.log(response.data);
      credDetails = response.data;

      this.cardNo = credDetails[0];
      this.expiry = credDetails[1];
      this.name = credDetails[2];
       
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.transactionCreds.value);
    //use login endpoint
    axios.post('/api/v1/paymentThroughCreditCard' , this.transactionCreds.value).then(response => {
      console.log(response.data);
      console.log(response);

      if(response.data == "Success") {
        window.alert("Success!")
      }else {
        window.alert("Failure")
      }

      // localStorage.setItem('accesscookie', response.data);
      // if (response.data === "correct") { sessionStorage.setItem('login', 'true') };
      // window.location.reload(); //comment out at debugging
    })
  }
}
