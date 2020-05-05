import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../model/user';

const apiUrl = "http://localhost/"; //"http://176.63.245.216:1235/"

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    @Output() userLoginEmitter: EventEmitter<any> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.userLoginEmitter.emit(JSON.parse(localStorage.getItem('currentUser')));
    }

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

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getUserDetails(): User {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    login(email: string, password: string) {
        return this.http.post<any>(apiUrl + 'users/login/', { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.userLoginEmitter.emit(user);
                }

                return user;
            }),
                catchError(this.handleError)
            );
    }

    getEmitter() {
        return this.userLoginEmitter;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.userLoginEmitter.emit(null);
    }
}