import { Component } from '@angular/core';
import { flushMicrotasks } from '@angular/core/testing';
import { axios } from 'src/utilities/axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  datapoints: number[][] = [[]];

  title = 'material-girl';
  isLoggedIn: boolean = false;
  managerisLoggedIn: boolean = false;
  hasSavings: boolean = true;
  hasLoan: boolean = true;
  hasCredit: boolean = true;
  hasCurrent: boolean = true;

  displayAccountButtons = true;

  displaySavings: boolean = false;
  displayCurrent: boolean = false;
  displayCredit: boolean = false;
  displayLoan: boolean = false;
  displayGraph: boolean = false;

  graphingdatacalled: boolean = false;

  // See something for cookie disabled people
  constructor() {
    // if (sessionStorage.getItem('login') === 'true') {
    //   this.isLoggedIn = true;
    // }
    axios.get('/api/v1/login').then(response => {
      this.isLoggedIn = (String(response.data) === 'true');

      if (this.isLoggedIn === true) {
        axios.get("/api/v1/hasSavings").then(response => {
          console.log("OYE Savings hei: " + response.data);
          console.log(response.data);
          this.hasSavings = response.data;
        });
        axios.get("/api/v1/hasLoan").then(response => {
          console.log("OYE Savings hei: " + response.data);
          console.log(response.data);
          this.hasLoan = response.data;
        });
        axios.get("/api/v1/hasCurrent").then(response => {
          console.log("OYE Savings hei: " + response.data);
          console.log(response.data);
          this.hasCurrent = response.data;
        });
        axios.get("/api/v1/hasCredit").then(response => {
          console.log("OYE Savings hei: " + response.data);
          console.log(response.data);
          this.hasCredit = response.data;
        });
      }

    });
    const checklogin1 = window.setInterval(() => {
      axios.get('/api/v1/login').then(response => {
        this.isLoggedIn = (String(response.data) === 'true');
        if (this.isLoggedIn == false) window.clearInterval(checklogin1);
      });
    }, 60000); //check every minute if user is logged in
    axios.get('/api/v1/managerlogin').then(response => {
      this.managerisLoggedIn = (String(response.data) === 'true');
      if (this.managerisLoggedIn === true) {
        axios.get('/api/v1/gettxnsweekwise').then(response => {
          this.datapoints = response.data;
        })

      }
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
    this.displayLoan = false;
    this.displayCredit = false;
    this.displayGraph = false;

    this.displayAccountButtons = false;
  }

  loadCurrent() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = false;
    this.displayCurrent = true;
    this.displayCredit = false;
    this.displayLoan = false;
    this.displayGraph = false;

    this.displayAccountButtons = false;
  }

  loadCredit() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = false;
    this.displayCurrent = false;
    this.displayCredit = true;
    this.displayLoan = false;
    this.displayGraph = false;

    this.displayAccountButtons = false;
  }

  loadLoan() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = false;
    this.displayCurrent = false;
    this.displayCredit = false;
    this.displayLoan = true;
    this.displayGraph = false;

    this.displayAccountButtons = false;
  }

  loadGraph() {
    this.displaySavings = false;
    this.displayCurrent = false;
    this.displayCredit = false;
    this.displayLoan = false;
    this.displayGraph = true;
    // goal is to fetch data whenever called
    // create aggregator query

    this.displayAccountButtons = false;
  }


  goHome() {
    this.displaySavings = false;
    this.displayCurrent = false;
    this.displayCredit = false;
    this.displayLoan = false;

    this.displayAccountButtons = true;
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
