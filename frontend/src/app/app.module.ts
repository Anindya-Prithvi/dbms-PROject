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
import { CurrentLandingComponent } from './current-landing/current-landing.component';
import { CurrentPassbookComponent } from './current-passbook/current-passbook.component';
import { CurrentSendMoneyComponent } from './current-send-money/current-send-money.component';
import { CurrentSendMoneyDebitCardComponent } from './current-send-money-debit-card/current-send-money-debit-card.component';
import { CreditLandingComponent } from './credit-landing/credit-landing.component';
import { LoanLandingComponent } from './loan-landing/loan-landing.component';
import { CreditPassbookComponent } from './credit-passbook/credit-passbook.component';
import { CreditSendMoneyComponent } from './credit-send-money/credit-send-money.component';
import { LoanPassbookComponent } from './loan-passbook/loan-passbook.component';
import { SavingTransactionsViewComponent } from './saving-transactions-view/saving-transactions-view.component';
import { CreditTransactionsViewComponent } from './credit-transactions-view/credit-transactions-view.component';
import { CurrentTransactionsViewComponent } from './current-transactions-view/current-transactions-view.component';
import { LoanTransactionsViewComponent } from './loan-transactions-view/loan-transactions-view.component';
import { TransactionsGraphComponent } from './transactions-graph/transactions-graph.component';
import { CreditSendMoneyCreditCardComponent } from './credit-send-money-credit-card/credit-send-money-credit-card.component';
import { DirectAccountTransferComponent } from './direct-account-transfer/direct-account-transfer.component';

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
    SavingPassbookSendMoneyCreditCardComponent,
    CurrentLandingComponent,
    CurrentPassbookComponent,
    CurrentSendMoneyComponent,
    CurrentSendMoneyDebitCardComponent,
    CreditLandingComponent,
    LoanLandingComponent,
    CreditPassbookComponent,
    CreditSendMoneyComponent,
    LoanPassbookComponent,
    SavingTransactionsViewComponent,
    CreditTransactionsViewComponent,
    CurrentTransactionsViewComponent,
    LoanTransactionsViewComponent,
    TransactionsGraphComponent,
    CreditSendMoneyCreditCardComponent,
    DirectAccountTransferComponent
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
