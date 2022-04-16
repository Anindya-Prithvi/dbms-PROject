import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-girl';
  isLoggedIn: boolean = false;
  authCookie: String = '';
  hasSavings: boolean = true;
  hasLoan: boolean = true;
  hasCredit: boolean = true;
  hasCurrent: boolean = true;

  displaySavings: boolean = false;

  // See something for cookie disabled people
  constructor(private cookieService: CookieService) {
    this.authCookie = this.cookieService.get('accesscookie');
    this.isLoggedIn = this.validateAuthCookie(this.authCookie);
  }

  validateAuthCookie(authCookie: String): boolean {
    return authCookie != '';
  }

  loadSavings() {
    console.log("Savings uhdwudheuhload kar");
    console.log("PAGALPAN")
    this.displaySavings = true;

  }

  goHome() {
    this.displaySavings = false;
  }

  // loadData() {
  //   this.showSpinner = true;
  //   setTimeout(() => this.showSpinner = false, 5000);
  // }
}
