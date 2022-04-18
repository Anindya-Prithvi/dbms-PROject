import { Component, OnInit } from '@angular/core';
import {axios} from '../../utilities/axios';

@Component({
  selector: 'app-saving-landing',
  templateUrl: './saving-landing.component.html',
  styleUrls: ['./saving-landing.component.css']
})
export class SavingLandingComponent implements OnInit {
  balance: Number = 100; 
  constructor() { 
    this.balance = this.getBalance();
  }


  ngOnInit(): void {
  }

  getBalance(): Number {
    axios.get("/savingsBalance").then(response => {
      console.log(response.data);
      return response.data;
    })
    return 0;
  }

  sendMoney() {
   console.log("Paisa Bhej");
  }

  showTransactions() {
    console.log("Passbook Dhika!");
  }

}
