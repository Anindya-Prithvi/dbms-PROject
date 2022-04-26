import { axios } from '../../utilities/axios';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-loan-passbook',
  templateUrl: './loan-passbook.component.html',
  styleUrls: ['./loan-passbook.component.css']
})
export class LoanPassbookComponent implements OnInit {

  ngOnInit(): void {
    // this.convertData();
    this.getData();
    // this.dataSource.paginator = this.paginator;
  
    // this.dataSource.data = TRANSACTION_DATA;
  }
  
  displayedColumns: string[] = ['transId', 'amount', 'time', 'toAccount', 'fromAccountId', 'type', 'cardNo'];
  // getData();
  
  // TRANSACTION_DATA!: Transaction[];
  constructor() {
    // this.getData();
  }
  
  dataSource = new MatTableDataSource<Transaction>(TRANSACTION_DATA);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   // this.convertData();
  //   this.getData();
  //   // this.dataSource.data = TRANSACTION_DATA;
  // }
  
  getData(): string[][] {
    let transactionsDump!: string[][];
    axios.get("/api/v1/loanTransaction").then(response => {
      console.log(response.data);
      // console.log("OYE TRANSACTIONS: " + response.data);
      // transactionsDump.push(response.data as string[][]);
      // console.log(response.data);
      // this.balance = response.data;
      // for(int i = 0; i < response.data.length; i++) {
  
      // }
  
      transactionsDump = response.data;
      // console.log(transactionsDump);
      for (const element of transactionsDump) {
        console.log(element);
        TRANSACTION_DATA.push({
          transId: element[0],
          amount: element[1],
          time: element[2],
          toAccount: element[3],
          fromAccountId: element[4],
          type: element[5],
          cardNo: element[6]
        });
        // TRANSACTION_DATA =  TRANSACTION_DATA.slice(1, );
        this.dataSource.data = TRANSACTION_DATA;
        this.dataSource.paginator = this.paginator;
  
      }
      // return transactionsDump;
    });
  
    // console.log(transactionsDump);
    return transactionsDump;
  }

}


export interface Transaction {
  transId: string;
  amount: string;
  time: string;
  toAccount: string;
  fromAccountId: string;
  type: string;
  cardNo: string;
}


let TRANSACTION_DATA: Transaction[] = [
  {
    transId: "",
    amount: "",
    time: "",
    toAccount: "",
    fromAccountId: "",
    type: "",
    cardNo: "",
  },
];
