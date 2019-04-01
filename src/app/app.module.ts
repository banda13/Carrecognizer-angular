import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {FileUploadModule} from 'ng2-file-upload';
import {ImagePreview} from './home/image-preview.directive';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { ChartsModule } from 'ng2-charts';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from './services/user.service';
import { ClassificationService } from './services/classification.service';
import { StatService } from './services/stat.service';

import { HomeComponent } from './home/home.component';
import { ClassificationsComponent } from './classifications/classifications.component';
import { AboutComponent } from './about/about.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';

import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClassificationsComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ImagePreview,
    UserComponent,
    LoginComponent,
    SignupComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      enableHtml: true
    }),
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    CookieService,
     UserService,
     ClassificationService,
     StatService,
     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
