import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-credit-send-money',
  templateUrl: './credit-send-money.component.html',
  styleUrls: ['./credit-send-money.component.css']
})
export class CreditSendMoneyComponent implements OnInit {
  
  showDebitCardPayment = false;
  showCreditCardPayment = false;
  fontStyleControl = new FormControl();

  // fontStyle?: string;

  selectPaymentMethod() {
    console.log(this.fontStyleControl.value);
    if(this.fontStyleControl.value == "credit") {
      this.showCreditCardPayment = true;
      this.showDebitCardPayment = false;
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
