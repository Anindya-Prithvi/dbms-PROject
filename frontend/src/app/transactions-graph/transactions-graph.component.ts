import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.css']
})
export class TransactionsGraphComponent implements OnInit {
  myScriptElement: HTMLScriptElement;
  Desmos: any;

  @Input()
  datapoints!: number[][];

  constructor() {
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
    document.body.appendChild(this.myScriptElement);

  }

  ngOnInit(): void {

    this.myScriptElement.onload = () => {
      this.Desmos = (<any>window).Desmos;
      console.log('loaded');
      document.getElementsByTagName('head')[0].appendChild(this.myScriptElement);
      var elt = document.getElementById('calculator');
      var calculator = this.Desmos.GraphingCalculator(elt);
      // instructions to populate
      // 1. see the line below, edit latex: 'someedits here'
      // I have already fille with points, if you maintain the syntax yayyy
      // dont do ched chaad above lol
      console.log(this.datapoints);
      calculator.setExpression({ id: 'count vs epoch', latex: '([11111111,1000000],[-1000,1000])' });
      calculator.setMathBounds({
        left: -10000000000,
        right: 10000000000,
        bottom: -10000000,
        top: 10000000
      });


    }

    console.log('rest');




  }

}
