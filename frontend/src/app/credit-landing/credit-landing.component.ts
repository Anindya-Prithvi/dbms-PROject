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
    this.getCreditLimit();
    this.getCreditSpent();
    this.getCreditAmountDue();
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

  getCreditSpent(): void {
    axios.get("/api/v1/getCreditSpent").then(response => {
      console.log("OYE Credit Spent: " + response.data);
      console.log(response.data);
      this.creditSpent = response.data;
    }); 
  }

  getCreditLimit(): void {
    axios.get("/api/v1/getCreditLimit").then(response => {
      console.log("OYE Credit Limit: " + response.data);
      console.log(response.data);
      this.creditLimit = response.data;
    }); 
  }

  getCreditAmountDue(): void {
    axios.get("/api/v1/getCreditAmountDue").then(response => {
      console.log("OYE Credit Amount: " + response.data);
      console.log(response.data);
      this.amountDue = response.data;
    }); 
  }

  // getCreditLimit(): void {
  //   axios.get("/api/v1/getCreditLimit").then(response => {
  //     console.log("OYE Credit Limit: " + response.data);
  //     console.log(response.data);
  //     this.creditLimit = response.data;
  //   }); 
  // }

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
