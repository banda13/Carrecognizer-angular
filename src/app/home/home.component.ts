import { Component, EventEmitter, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';


const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
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

  constructor(private toastr: ToastrService) {
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
  }

}
