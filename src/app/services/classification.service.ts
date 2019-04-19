import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
const apiUrl = "http://176.63.245.216:1235/";

@Injectable()
export class ClassificationService {

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

    classify(f) {
        console.log("Uploading file: " + f.name);
        let formData: FormData = new FormData();
        formData.append('carpic', f);

        return this.http.post(apiUrl + 'core/classify/', formData).pipe(
            map(response => {
                return response;
        }), catchError(this.handleError));
    }

}