import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User } from '../model/user';

const apiUrl = "http://176.63.245.216:1235/";

@Injectable()
export class UserService {
 
    constructor(private http: HttpClient) { }

    getDetails() {
        return this.http.get<User>(apiUrl + 'users/profile/');
    }

    register(user: User) {
        return this.http.post(apiUrl + 'users/create/', user);
    }
}