import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-saving-passbook-send-money-debit-card',
  templateUrl: './saving-passbook-send-money-debit-card.component.html',
  styleUrls: ['./saving-passbook-send-money-debit-card.component.css']
})
export class SavingPassbookSendMoneyDebitCardComponent implements OnInit {

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
  
  constructor() { 
    let debDetails!: string[];
    axios.get("/api/v1/getDebitCardDetails").then(response => {
      console.log("OYE Credit card hei: " + response.data);
      console.log(response.data);
      debDetails = response.data;

      this.cardNo = debDetails[0];
      this.expiry = debDetails[1];
      this.name = debDetails[2];
       
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.transactionCreds.value);
    //use login endpoint
    axios.post('/api/v1/paymentThroughDebitCard', this.transactionCreds.value).then(response => {
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
