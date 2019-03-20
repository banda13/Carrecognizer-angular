import { Component, OnInit } from '@angular/core';
import { StatService } from '../services/stat.service';

const MS_PER_MINUTE = 60000;
const MS_PER_SECOND = 1000;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  year : any;
  month : any;
  day : any;
  hour: any;
  minutes : any;
  seconds : any;

  intervalInSecond = 600;
  interval : any;
  refreshIntervalInSecond = 3;

  elements: any = [];

  headElements = ['ID', 'First', 'Last', 'Handle'];

  constructor(private statService: StatService) {
    this.refreshTime();
   }

  refreshTime(){
    let d = new Date();
    var currentdate = new Date(d.valueOf() - 30 * MS_PER_SECOND);
    this.year = currentdate.getFullYear();
    this.month = currentdate.getMonth() + 1;
    this.day = currentdate.getDate();
    this.hour = currentdate.getHours();
    this.minutes = currentdate.getMinutes();
    this.seconds = currentdate.getSeconds();
    console.log('Time update: ' + this.year + '-'+ this.month + '-' + this.day + " " + this.hour + ":" + this.minutes + ":" + this.seconds);
  }

  ngOnInit() {
    this.statService.getApiUsage(this.year, this.month, this.day, this.hour, this.minutes, this.seconds).subscribe(details => {
      this.elements = [];
        for(let d of details.results){
          if(d.path.startsWith('/users/')){
            this.elements.push(d);
          }
        }
    });

    this.interval = setInterval(() => {
      this.refreshTime();
      this.statService.getApiUsage(this.year, this.month, this.day, this.hour, this.minutes, this.seconds).subscribe(details => {
        this.elements = [];
        for(let d of details.results){
          if(d.path.startsWith('/users/')){
            this.elements.push(d);
            console.log(d);
          }
        }
      });
    }, this.refreshIntervalInSecond * MS_PER_SECOND);
  }
  ngOnDestroy() {
    console.log("destroying..");
    clearInterval(this.interval);
 }
}
