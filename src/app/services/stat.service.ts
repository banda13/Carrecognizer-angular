import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User } from '../model/user';
import { query } from '../../../node_modules/@angular/core/src/render3';

const apiUrl = "http://176.63.245.216:1235/";

@Injectable()
export class StatService {
 
    constructor(private http: HttpClient) { }

    getApiUsage(year, month, day, hour, minutes, seconds) {
        let queryParams : String = "";
        if(year != null){
            queryParams += "&year=" + year;
        }
        if(month != null){
            queryParams += "&month=" + month;
        }
        if(day != null){
            queryParams += "&day=" + day;
        }
        if(hour != null){
            queryParams += "&hour=" + hour;
        }
        if(minutes != null){
            queryParams += "&min=" + minutes;
        }
        if(seconds != null){
            queryParams += "&sec=" + seconds;
        }

        if(queryParams.length > 0){
            queryParams = '?' + queryParams.substring(1, queryParams.length);
        }
        else{
            queryParams = '';
        }
        return this.http.get<any>(apiUrl + 'stats/usage/' + queryParams);
    }
}