import { Component, OnInit } from '@angular/core';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-credit-landing',
  templateUrl: './credit-landing.component.html',
  styleUrls: ['./credit-landing.component.css']
})
export class CreditLandingComponent implements OnInit {
  balance: String = "";
  creditLimit: String = "";
  creditSpent: String = "";
  amountDue: String = "";
  showPassbook = false;
  showSendMoney = false;
  
  constructor() {
    this.getBalance();
  }

  ngOnInit(): void {
  }

  getBalance() {
    return axios.get("/api/v1/savingsBalance").then(response => {
      console.log("OYE BALANCE: " + response.data);
      console.log(response.data);
      this.balance = response.data;
    });

  }

  sendMoney() {
    console.log("Paisa Bhej");
    this.showSendMoney = true;
    this.showPassbook = false;
  }

  showTransactions() {
    console.log("Passbook Dhika!");
    this.showPassbook = true;
    this.showSendMoney = false;
  }
}
