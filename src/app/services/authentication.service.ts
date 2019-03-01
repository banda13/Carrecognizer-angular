import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../model/user';

const apiUrl = "http://localhost:8000"

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

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getUserDetails(): User{
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    login(email: string, password: string) {
        return this.http.post<any>(apiUrl + '/users/login/', {email, password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.userLoginEmitter.emit(user);
                }

                return user;
            }));
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