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
  authCookie: String = ''

  // See something for cookie disabled people
  constructor(private cookieService: CookieService) {
    this.authCookie = this.cookieService.get('AuthenticationToken');
    this.isLoggedIn = this.validateAuthCookie(this.authCookie);
  }

  validateAuthCookie(authCookie: String): boolean {
    return authCookie == 'admin';
  }
  // loadData() {
  //   this.showSpinner = true;
  //   setTimeout(() => this.showSpinner = false, 5000);
  // }

  adminLogin(): void {
    this.isLoggedIn = true;
    this.authCookie = "something";
    this.cookieService.set('AuthenticationToken', 'admin');
  }
}
