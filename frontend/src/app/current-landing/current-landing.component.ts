import { Component, OnInit } from '@angular/core';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-current-landing',
  templateUrl: './current-landing.component.html',
  styleUrls: ['./current-landing.component.css']
})
export class CurrentLandingComponent implements OnInit {
  balance: String = "";
  showPassbook = false;
  showSendMoney = false;

  constructor() {
    this.getBalance();
  }
  ngOnInit(): void {
  }
  getBalance() {
    return axios.get("/api/v1/currentBalance").then(response => {
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
