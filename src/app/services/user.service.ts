import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../model/user';

const apiUrl = "http://178.48.246.170:1235/";

@Injectable()
export class UserService {
 
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

            // log out the user in case of backend error!
            // remove user from local storage to log user out
        }
        // return an observable with a user-facing error message
        return throwError(error.error.error);
    };

    getDetails() {
        return this.http.get<User>(apiUrl + 'users/profile/').pipe(catchError(this.handleError));
    }

    register(user: User) {
        return this.http.post(apiUrl + 'users/create/', user).pipe(catchError(this.handleError));
    }
}