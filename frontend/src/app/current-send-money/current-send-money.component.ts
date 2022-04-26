import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-current-send-money',
  templateUrl: './current-send-money.component.html',
  styleUrls: ['./current-send-money.component.css']
})
export class CurrentSendMoneyComponent implements OnInit {

  showDebitCardPayment = false;
  // showCreditCardPayment = false;
  fontStyleControl = new FormControl();


  selectPaymentMethod() {
    console.log(this.fontStyleControl.value);
    if(this.fontStyleControl.value == "debit") {
      this.showDebitCardPayment = true;
    }else{ 
      this.showDebitCardPayment = false;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
