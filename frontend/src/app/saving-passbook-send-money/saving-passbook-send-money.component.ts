import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-saving-passbook-send-money',
  templateUrl: './saving-passbook-send-money.component.html',
  styleUrls: ['./saving-passbook-send-money.component.css']
})
export class SavingPassbookSendMoneyComponent implements OnInit {

  showDebitCardPayment = false;
  showCreditCardPayment = false;
  fontStyleControl = new FormControl();

  // fontStyle?: string;

  selectPaymentMethod() {
    console.log(this.fontStyleControl.value);
    if(this.fontStyleControl.value == "debit") {
      
      this.showDebitCardPayment = true;
      this.showCreditCardPayment = false;
    }else if(this.fontStyleControl.value == "credit") {
      this.showCreditCardPayment = true;
      this.showDebitCardPayment = false;
    }
  }

  constructor() {

    // this.fontStyleControl.registerOnChange(this.selectPaymentMethod);
    
   }

  ngOnInit(): void {
    // this.fontStyleControl.registerOnChange(this.selectPaymentMethod);
  }
  

}
