import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { User } from '../model/user';

const apiUrl = "http://localhost:8000/";

@Injectable()
export class UserService {
 
    constructor(private http: HttpClient) { }

    getDetails() {
        return this.http.get<User>(apiUrl + 'users/profile/');
    }
}