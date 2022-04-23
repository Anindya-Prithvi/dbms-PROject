import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';
import { SavingLandingComponent } from './saving-landing/saving-landing.component';
import { SavingPassbookComponent } from './saving-passbook/saving-passbook.component';
import { SavingPassbookSendMoneyComponent } from './saving-passbook-send-money/saving-passbook-send-money.component';
import { SavingPassbookSendMoneyDebitCardComponent } from './saving-passbook-send-money-debit-card/saving-passbook-send-money-debit-card.component';
import { SavingPassbookSendMoneyCreditCardComponent } from './saving-passbook-send-money-credit-card/saving-passbook-send-money-credit-card.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    SavingLandingComponent,
    SavingPassbookComponent,
    SavingPassbookSendMoneyComponent,
    SavingPassbookSendMoneyDebitCardComponent,
    SavingPassbookSendMoneyCreditCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
