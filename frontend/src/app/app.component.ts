import { Component } from '@angular/core';
import { flushMicrotasks } from '@angular/core/testing';
import { axios } from 'src/utilities/axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-girl';
  isLoggedIn: boolean = false;
  managerisLoggedIn: boolean = false;
  hasSavings: boolean = true;
  hasLoan: boolean = true;
  hasCredit: boolean = true;
  hasCurrent: boolean = true;

  displaySavings: boolean = false;
  displayCurrent: boolean = false;

  // See something for cookie disabled people
  constructor() {
    // if (sessionStorage.getItem('login') === 'true') {
    //   this.isLoggedIn = true;
    // }
    axios.get('/api/v1/login').then(response => {
      this.isLoggedIn = (String(response.data) === 'true');
    });
    const checklogin1 = window.setInterval(() => {
      axios.get('/api/v1/login').then(response => {
        this.isLoggedIn = (String(response.data) === 'true');
        if (this.isLoggedIn == false) window.clearInterval(checklogin1);
      });
    }, 60000); //check every minute if user is logged in
    axios.get('/api/v1/managerlogin').then(response => {
      this.managerisLoggedIn = (String(response.data) === 'true');
    });
    const checklogin2 = window.setInterval(() => {
      axios.get('/api/v1/managerlogin').then(response => {
        this.managerisLoggedIn = (String(response.data) === 'true');
        if (this.managerisLoggedIn == false) window.clearInterval(checklogin2);
      });
    }, 60000); //check every minute if user is logged in
  };


  loadSavings() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = true;
    this.displayCurrent = false;

  }

  loadCurrent() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = false; 
    this.displayCurrent = true;
  }

  goHome() {
    this.displaySavings = false;
    this.displayCurrent = false;
  }

  logout() {
    this.isLoggedIn = false;
    this.managerisLoggedIn = false;
    axios.get('/api/v1/logout').then(response => {
      console.log("satchel out");
      // window.location.reload();
    })
  }

  // loadData() {
  //   this.showSpinner = true;
  //   setTimeout(() => this.showSpinner = false, 5000);
  // }
}
