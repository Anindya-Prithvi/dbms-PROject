import { Component, OnInit } from '@angular/core';
import { loadavg } from 'os';
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
    let loanDeats: String[];
    axios.get("/api/v1/displayLoanAccountDetails").then(response => {
      console.log("OYE BALANCE: " + response.data);
      console.log(response.data);
      loanDeats = response.data;

      this.principal = loanDeats[0];
      this.amountDue = loanDeats[1];
      this.interestRate = loanDeats[2];
      this.billingCycle = loanDeats[3];
      this.dueDate = loanDeats[4];      
    });
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
