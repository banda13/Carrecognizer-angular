import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { FILE } from 'dns';

const apiUrl = "http://localhost:8000/";

@Injectable()
export class ClassificationService {

    constructor(private http: HttpClient) { }

    classify(f) {
        console.log("Uploading file: " + f.name);
        let formData: FormData = new FormData();
        formData.append('carpic', f);

        return this.http.post(apiUrl + 'core/classify/',formData);
    }

}