import { Component, EventEmitter, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { AuthenticationService } from '../services/authentication.service';
import { ClassificationService } from '../services/classification.service';
import { StatService } from '../services/stat.service';

const URL = 'http://localhost:8000/core/classify/';
const maxFileSize = 5 * 1024 * 1024;
const allowedMimeType = 'jpg';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  styles: [`
      .my-drop-zone { border: dotted 3px lightgray; }
    .nv-file-over { border: dotted 3px red; } 
    .another-file-over-class { border: dotted 3px green; }    
 
    html, body { height: 100%; }
  `]
})
export class HomeComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({
    url: URL,
    //disableMultipart: true,
    maxFileSize: maxFileSize,
    queueLimit: 1,
    itemAlias: 'carpic',
    filters: [{
      name: 'imageExtension',
      fn: (item: any): boolean => {
        let fileExt = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
        return fileExt === allowedMimeType ? true : false;
      }
    }]
  });


  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  fileObject: any;

  lastClassification: any;
  lastFileObject: any;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];

    console.log(file);
    this.toastr.info(file.name);
  }

  public classify() {
    const file: File = this.uploader.queue[0]._file;
    console.log("Classification started: " + file.name);
    this.statService.getAvgClassificationTime().subscribe(resp => {
      var classTime = resp['avg_class_time'];
      console.log(classTime);
      const uploader = this.uploader;
      uploader.progress = 0;
      const step = 100 / classTime;

      var downloadTimer = setInterval(function(){
        if(classTime <= 0){
          clearInterval(downloadTimer);
        }
        uploader.progress += step;
        classTime -= 1;
      }, 1000);

      this.toastr.info("Classification started...");
      this.classificationService.classify(file).subscribe(data => {
        this.lastClassification = data;
        this.toastr.success("Classification was successful!");
        this.lastFileObject = file;
        this.uploader.clearQueue();
        this.uploader.progress = 100;
      },
        error => {
          if (error === undefined) {
            this.toastr.error("Unexpected server error, please try again later");
          }
          else if (error.status !== 401) {
            this.toastr.error(error);
          }
          console.log("Unexpected exception while classification");
        });
    }, 
    error => {
      this.toastr.error("Failed to start progess bar");
      console.log(error);
    });
  }

  constructor(private toastr: ToastrService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private classificationService: ClassificationService,
    private statService: StatService) {
  }

  ngOnInit() {
    this.uploader.onWhenAddingFileFailed = (fileItem, filter) => {
      let message = '';
      let description = '';
      switch (filter.name) {
        case 'queueLimit':
          message = 'You can only upload 1 image!';
          description = 'After classification you can upload a new one, or you can delete the uploaded image';
          break;
        case 'fileSize':
          message = 'File size is too large';
          description = 'Allowed max file size is ' + maxFileSize;
          break;
        default:
        case 'imageExtension':
          message = 'Not allowed extension!';
          description = 'Allowed extension is : ' + allowedMimeType;
          break;
      }

      this.toastr.error(description, message);
    }

    this.uploader.onAfterAddingFile = (file) => {
      console.log("File added");
      this.uploader.setOptions({ headers: [{ name: 'withCredentials', value: 'true' }] });
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('File uploaded successfully');
    };

  }

}
