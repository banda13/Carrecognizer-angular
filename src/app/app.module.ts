import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {FileUploadModule} from 'ng2-file-upload';
import {ImagePreview} from './home/image-preview.directive';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { ClassificationsComponent } from './classifications/classifications.component';
import { AboutComponent } from './about/about.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClassificationsComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ImagePreview
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
    }) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
