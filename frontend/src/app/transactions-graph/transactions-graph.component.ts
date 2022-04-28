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
      var calculator = this.Desmos.GraphingCalculator(elt, { keypad: false, expressions: false, settingsMenu: false, expressionsCollapsed: true });

      // instructions to populate
      // 1. see the line below, edit latex: 'someedits here'
      // I have already fille with points, if you maintain the syntax yayyy
      // dont do ched chaad above lol
      // this.datapoints = [[1, 2], [3, 4]];

      let maxx = 0;
      let minx = 100000000000;
      let maxy = 0;

      let latexinput: string = '[';
      for (let index = 0; index < this.datapoints.length - 1; index++) {
        const element = '(' + this.datapoints[index].toString() + '),';
        latexinput += element;
        maxx = Math.max(maxx, this.datapoints[index][0]);
        minx = Math.min(minx, this.datapoints[index][0]);
        maxy = Math.max(maxy, this.datapoints[index][1]);
      }
      latexinput += '(' + this.datapoints[this.datapoints.length - 1] + ')]';
      console.log(this.datapoints);



      calculator.setExpression({ id: 'count vs epoch', latex: latexinput });
      calculator.setMathBounds({
        left: minx - 10000000,
        right: maxx + 10000000,
        bottom: -1,
        top: maxy + 100000000
      });


    }

    console.log('rest');




  }

}
