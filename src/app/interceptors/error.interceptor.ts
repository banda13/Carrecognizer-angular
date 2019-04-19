import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router,private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                this.router.navigate(['/login']);
                this.toastr.info('Please log in!');
                //TODO refresh token instead of loggin out user!
            }
            else{
                //TODO send error statistics 
            }

            return throwError(err);
        }))
    }
}

/*
HELP

The Error Interceptor intercepts http responses from the api to check if there were any errors.
 If there is a 401 Unauthorized response the user is automatically logged out of the application, all other errors are re-thrown to be caught by the calling service so an alert can be displayed to the user.

It's implemented using the HttpInterceptor class that was introduced in Angular 4.3 as part of the new HttpClientModule.
 By extending the HttpInterceptor class you can create a custom interceptor to catch all error responses from the server in a single location.

*/