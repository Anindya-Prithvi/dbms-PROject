import { Component, OnInit } from '@angular/core';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-loan-landing',
  templateUrl: './loan-landing.component.html',
  styleUrls: ['./loan-landing.component.css']
})
export class LoanLandingComponent implements OnInit {
  balance: String = "";
  amountDue: String = "";
  principal: String = "";
  billingCycle: String = "";
  dueDate: String = "";
  interestRate: String = "";
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
