import { Component, OnInit } from '@angular/core';
import {axios} from '../../utilities/axios';

@Component({
  selector: 'app-saving-landing',
  templateUrl: './saving-landing.component.html',
  styleUrls: ['./saving-landing.component.css']
})
export class SavingLandingComponent implements OnInit {
  balance: String = "";
  showPassbook = false;

  constructor() { 
    this.getBalance();
  }


  ngOnInit(): void {
  }

  getBalance() {
    return axios.get("/savingsBalance").then(response => {
      console.log("OYE BALANCE: " + response.data);
      console.log(response.data);
      this.balance = response.data;
    });

  }

  sendMoney() {
   console.log("Paisa Bhej");
  }

  showTransactions() {
    console.log("Passbook Dhika!");
    this.showPassbook = true;
  }

}
