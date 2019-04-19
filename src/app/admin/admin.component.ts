import { Component, OnInit, ViewChild } from '@angular/core';
import { StatService } from '../services/stat.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

const MS_PER_MINUTE = 60000;
const MS_PER_SECOND = 1000;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  year: any;
  month: any;
  day: any;
  hour: any;
  minutes: any;
  seconds: any;

  intervalInSecond = 600;
  interval: any;
  refreshIntervalInSecond = 10;

  userInteractions: any = [];

  public lineChartData: ChartDataSets[] = [
    { data: [0], label: 'Api usage' }
  ];
  public lineChartLabels: Label[] = ["0", "0", "0", "0", "0", "0", "0", "0"];
  public lineChartType = 'line';
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public barChartLegend = true;
  public lineChartPlugins = [pluginAnnotations];

  headElements = ['Username', 'Time', 'Method', 'Path'];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private statService: StatService) {
    this.refreshTime();
  }

  refreshTime() {
    let d = new Date();
    var currentdate = new Date(d.valueOf() - this.refreshIntervalInSecond * MS_PER_SECOND);
    this.year = currentdate.getFullYear();
    this.month = currentdate.getMonth() + 1;
    this.day = currentdate.getDate();
    this.hour = currentdate.getHours();
    this.minutes = currentdate.getMinutes();
    this.seconds = currentdate.getSeconds();
    console.log('Time update: ' + this.year + '-' + this.month + '-' + this.day + " " + this.hour + ":" + this.minutes + ":" + this.seconds);
  }

  refreshChartData(newUsage) {
    console.log(newUsage);
    let oldData = this.lineChartData[0].data;
    let newData = new Array();
    for (let d of oldData) {
      newData.push(d);
    }
    newData.push(newUsage.length);
    this.lineChartData = new Array(1);
    this.lineChartData[0] = { data: newData, label: 'Api usage' };
    this.lineChartLabels = new Array(newData.length);

    console.log(this.lineChartData[0]);

    for (let d of newUsage) {
      if (d.path.startsWith('/users/')) {
        this.userInteractions.push(d);
      }
    }
  }

  ngOnInit() {
    this.statService.getApiUsage(this.year, this.month, this.day, this.hour, this.minutes, this.seconds).subscribe(details => {
      this.userInteractions = [];
      this.refreshChartData(details.results);
      for (let d of details.results) {
        if (d.path != "/stats/usage/" && d.username != "") {
          this.userInteractions.push(d);
          if (this.userInteractions.length > 4) {
            this.userInteractions.shift();
          }
        }
      }
    });

    this.interval = setInterval(() => {
      this.refreshTime();
      this.statService.getApiUsage(this.year, this.month, this.day, this.hour, this.minutes, this.seconds).subscribe(details => {
        this.refreshChartData(details.results);
        for (let d of details.results) {
          if (d.path != "/stats/usage/" && d.username != "") {
            this.userInteractions.push(d);
            if (this.userInteractions.length > 4) {
              this.userInteractions.shift();
              console.log(this.userInteractions);
            }
          }
        }
      }
      );
    }, this.refreshIntervalInSecond * MS_PER_SECOND);
  }
  ngOnDestroy() {
    console.log("destroying..");
    clearInterval(this.interval);
  }
}
