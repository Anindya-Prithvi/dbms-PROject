import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-current-send-money',
  templateUrl: './current-send-money.component.html',
  styleUrls: ['./current-send-money.component.css']
})
export class CurrentSendMoneyComponent implements OnInit {

  showDebitCardPayment = false;
  showDirectPayment = false;
  fontStyleControl = new FormControl();


  selectPaymentMethod() {
    console.log(this.fontStyleControl.value);
    if(this.fontStyleControl.value == "debit") {
      this.showDebitCardPayment = true;
    }else if(this.fontStyleControl.value == "direct"){ 
      this.showDebitCardPayment = false;
      this.showDirectPayment = true;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
