import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const apiUrl = "http://176.63.245.216:1235/";

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