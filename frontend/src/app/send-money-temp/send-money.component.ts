import { Component, OnInit } from '@angular/core';
import {axios} from '../../utilities/axios';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SavingLandingComponent implements OnInit {
  balance: String = "";
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

  sendMoney(_fromAccountNo: number, _toAccountNo : number , _amount: number , _method:string) {
    axios.post('/sendMoney', {
      fromAccountNo: _fromAccountNo,
      toAccountNo: _toAccountNo,
      amount: _amount,
      modeOfPayment: _method
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  showTransactions() {
    console.log("Passbook Dhika!");
  }

}
