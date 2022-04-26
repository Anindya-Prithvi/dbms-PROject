import { axios } from '../../utilities/axios';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-saving-passbook',
  templateUrl: './saving-passbook.component.html',
  styleUrls: ['./saving-passbook.component.css']
})
export class SavingPassbookComponent implements OnInit {

  // constructor() { }

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
    axios.get("/api/v1/savingsTransaction").then(response => {
      console.log(response.headers);
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

  // convertData() {
  //   let transactionsData = (this.getData());
  //   for (let i = 0; i < transactionsData.length; i++) {
  //     console.log(transactionsData[i]);
  //   }
  // }


}

// @Component
// class TestingProc implements OnInit {
//    // constructor() { }

//   ngOnInit(): void {
//     this.getData();
//   }

//   getData() {
//     let transactionsDump!: string[][];
//     axios.get("/api/v1/savingsTransaction").then(response => {
//       console.log(response.headers);
//       // console.log("OYE TRANSACTIONS: " + response.data);
//       // transactionsDump.push(response.data as string[][]);
//       // console.log(response.data);
//       // this.balance = response.data;
//       // for(int i = 0; i < response.data.length; i++) {

//       // }

//       transactionsDump = response.data;
//       // console.log(transactionsDump);
//       for (const element of transactionsDump) {
//         console.log(element);
//         TRANSACTION_DATA.push({
//           transId: element[0],
//           amount: element[1],
//           time: element[2],
//           toAccount: element[3],
//           fromAccountId: element[4],
//           type: element[5],
//           cardNo: element[6]
//         });
//         // this.dataSource.data = this.TRANSACTION_DATA;
//       } 
//       // return transactionsDump;
//     });

//   }
// }

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



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

