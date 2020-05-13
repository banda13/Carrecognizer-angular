import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../model/user';
import { query } from '../../../node_modules/@angular/core/src/render3';

const apiUrl = "http://178.48.246.170:1235/";

@Injectable()
export class StatService {
 
    constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(error.error.error);
    };

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
        return this.http.get<any>(apiUrl + 'stats/usage/' + queryParams).pipe(catchError(this.handleError));
    }
}