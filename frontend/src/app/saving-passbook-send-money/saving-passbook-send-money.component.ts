import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-saving-passbook-send-money',
  templateUrl: './saving-passbook-send-money.component.html',
  styleUrls: ['./saving-passbook-send-money.component.css']
})
export class SavingPassbookSendMoneyComponent implements OnInit {

  showDebitCardPayment = false;
  showDirectPayment = false;
  fontStyleControl = new FormControl();

  // fontStyle?: string;

  selectPaymentMethod() {
    console.log(this.fontStyleControl.value);
    if(this.fontStyleControl.value == "debit") {
      
      this.showDebitCardPayment = true;
      this.showDirectPayment = false;
    }else if(this.fontStyleControl.value == "direct") {
      this.showDirectPayment = true;
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
