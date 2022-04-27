import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { axios } from '../../utilities/axios';

@Component({
  selector: 'app-direct-account-transfer',
  templateUrl: './direct-account-transfer.component.html',
  styleUrls: ['./direct-account-transfer.component.css']
})
export class DirectAccountTransferComponent implements OnInit {
  cardNo = "xxxx xxxx xxxx 1234";
  expiry = "xx/xx";
  name = "Vibster";

  transactionCreds = new FormGroup({
    toAccount: new FormControl('', [Validators.required]),
    toAccountType: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required])
  })

  @Input()
  apiGateway: string | undefined = undefined;

  constructor() { 
    let credDetails!: string[];
    axios.get("/api/v1/getCreditCardDetails").then(response => {
      console.log("OYE Credit card hei: " + response.data);
      console.log(response.data);
      credDetails = response.data;

      this.cardNo = credDetails[0];
      this.expiry = credDetails[1];
      this.name = credDetails[2];
       
    });
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
    console.log(this.transactionCreds.value);
    //use login endpoint
    axios.post('/api/v1/' + this.apiGateway , this.transactionCreds.value).then(response => {
      console.log(response.data);
      console.log(response);

      if(response.data == "Success") {
        window.alert("Success!")
      }else {
        window.alert("Failure")
      }

      // localStorage.setItem('accesscookie', response.data);
      // if (response.data === "correct") { sessionStorage.setItem('login', 'true') };
      // window.location.reload(); //comment out at debugging
    })
  }
}
