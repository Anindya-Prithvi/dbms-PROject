import { axios } from '../../utilities/axios';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-current-transactions-view',
  templateUrl: './current-transactions-view.component.html',
  styleUrls: ['./current-transactions-view.component.css']
})
export class CurrentTransactionsViewComponent implements OnInit {

  ngOnInit(): void {
    // this.convertData();
    this.getData();
    // this.dataSource.paginator = this.paginator;

    // this.dataSource.data = TRANSACTION_DATA;
  }

  // transId: string;
  // customerId: string;
  // amount: string;
  // time: string;
  // toAccount: string;
  // fromAccount: string;
  // type: string;
  // cardNo: string;
  // creditDebit: string;

  displayedColumns: string[] = ['transId', 'customerId', 'amount', 'time', 'toAccount', 'fromAccount', 'creditDebit'];

  constructor() {
  }

  dataSource = new MatTableDataSource<Transaction>(TRANSACTION_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;



  getData(): string[][] {
    let transactionsDump!: string[][];
    axios.get("/api/v1/allCurrentAccountTransactionsForManager").then(response => {
      console.log(response.headers);
      // console.log("OYE TRANSACTIONS: " + response.data);
      // transactionsDump.push(response.data as string[][]);
      // console.log(response.data);
      

  // transId: string;
  // customerId: string;
  // amount: string;
  // time: string;
  // toAccount: string;
  // fromAccount: string;
  // type: string;
  // cardNo: string;
  // creditDebit: string;

      transactionsDump = response.data;
      // console.log(transactionsDump);
      for (const element of transactionsDump) {
        // console.log(element);
        TRANSACTION_DATA.push({
          transId: element[0],
          customerId: element[1],
          amount: element[2],
          time: element[3],
          toAccount: element[4],
          fromAccount: element[5],
          creditDebit: element[6]
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
  customerId: string;
  amount: string;
  time: string;
  toAccount: string;
  fromAccount: string;
  creditDebit: string;
}


let TRANSACTION_DATA: Transaction[] = [
  {
    transId: "",
    customerId: "",
    amount: "",
    time: "",
    toAccount: "",
    fromAccount: "",
    creditDebit: "",
  },
];



