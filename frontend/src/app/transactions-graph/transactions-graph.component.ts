import { Component, OnInit } from '@angular/core';
const Desmos = require('src/assets/calculator');

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.css']
})
export class TransactionsGraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var elt = document.getElementById('calculator');
    var calculator = Desmos.GraphingCalculator(elt);
    // instructions to populate
    // 1. see the line below, edit latex: 'someedits here'
    // I have already fille with points, if you maintain the syntax yayyy
    calculator.setExpression({ id: 'count vs epoch', latex: '([11111111,1000000],[-1000,1000])' });
    calculator.setMathBounds({
      left: -10000000000,
      right: 10000000000,
      bottom: -10000000,
      top: 10000000
    });
  }

}
