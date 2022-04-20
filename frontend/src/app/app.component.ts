import { Component } from '@angular/core';
import { axios } from 'src/utilities/axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-girl';
  isLoggedIn: boolean = false;
  hasSavings: boolean = true;
  hasLoan: boolean = true;
  hasCredit: boolean = true;
  hasCurrent: boolean = true;

  displaySavings: boolean = false;


  // See something for cookie disabled people
  constructor() {
    // if (sessionStorage.getItem('login') === 'true') {
    //   this.isLoggedIn = true;
    // }
    axios.get('/api/v1/login').then(response => {
      this.isLoggedIn = (String(response.data) === 'true');
    });
    const checklogin = window.setInterval(() => {
      axios.get('/api/v1/login').then(response => {
        this.isLoggedIn = (String(response.data) === 'true');
        if (this.isLoggedIn == false) window.clearInterval(checklogin);
      });
    }, 60000); //check every minute if user is logged in
  };


  loadSavings() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = true;

  }

  goHome() {
    this.displaySavings = false;
  }

  logout() {
    sessionStorage.setItem('login', 'false');
    this.isLoggedIn = false;
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
