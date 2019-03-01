import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import {UserService} from '../services/user.service';
import { User } from '../model/User';

@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.css']
})
export class ClassificationsComponent implements OnInit {
  @ViewChildren('list') list: QueryList<ElementRef>;
  paginators: Array<any> = [];
  activePage: number = 1;
  firstVisibleIndex: number = 1;
  lastVisibleIndex: number = 10;
  tableData = [];
  sorted = false;
  searchText: string;
  firstPageNumber: number = 1;
  lastPageNumber: number = 1;
  maxVisibleItems: number = 5;

  totalCount = 0;


  url: any = 'http://localhost:8000/core/classlist/';
  nextUrl: any = 'http://localhost:8000/core/classlist/';
  prevUrl: any = 'http://localhost:8000/core/classlist/';
  firstUrl: any = 'http://localhost:8000/core/classlist/';
  lastUrl: any = 'http://localhost:8000/core/classlist/';


  orderby: any;
  order_val: any;
  filter: any;
  filter_val: any;

  constructor(private http: HttpClient, private toastr: ToastrService, private userService: UserService) { }

  getData(url) {
    return this.http.get(url);
  }

  loadPage(url) {
    if (url.endsWith("/")) {
      url += "?";
    }

    if (this.orderby != null && this.order_val != null) {
      url += "&orderby=" + this.orderby + "&order_val=" + this.order_val;
    }
    if (this.filter != null) {
      url += "&filter=" + this.filter;
    }
    this.getData(url).subscribe((next: any) => {
      let data = next.results;
      this.totalCount = next.count;
      this.lastPageNumber = Math.ceil(this.totalCount / this.maxVisibleItems);

      this.firstVisibleIndex = this.activePage * this.maxVisibleItems - this.maxVisibleItems + 1;
      this.lastVisibleIndex = this.activePage * this.maxVisibleItems;

      this.nextUrl = next.next;
      this.prevUrl = next.previous;
      this.lastUrl = this.url + "?page=" + this.lastPageNumber;
      this.firstUrl = this.url + "?page=" + this.firstPageNumber;

      this.tableData = [];
      data.forEach((element: any) => {
        this.tableData.push({ id: (element.id).toString(), created_at: element.created_at, image: element.image.file_name });
      });

      this.paginators = [];
      for (let i = 1; i <= this.totalCount; i++) {
        if (i % this.maxVisibleItems === 0) {
          this.paginators.push(i / this.maxVisibleItems);
        }
      }
      if (this.totalCount % this.paginators.length !== 0) {
        this.paginators.push(this.paginators.length + 1);
      }
    },
      (err: any) => {
        this.toastr.error(err.message, "Failed to load data!");
      });
  }

  ngOnInit() {
    this.loadPage(this.url);
  }

  @HostListener('input') oninput() {
    this.searchText = this.searchText.trim();
    console.log(this.searchText);
    this.activePage = 1;
    if (this.searchText !== null && this.searchText !== '') {
      this.filterIt(this.tableData, this.searchText);
    }
    else {
      this.filter = null;
      this.loadPage(this.url);
    }
  }

  changePage(event: any) {
    this.activePage = event.target.text;
    this.loadPage(this.url + "?page=" + this.activePage);
  }

  nextPage() {
    this.activePage += 1;
    if (this.nextUrl != null) {
      this.loadPage(this.nextUrl);
    }
  }
  previousPage() {
    this.activePage -= 1;
    if (this.prevUrl != null) {
      this.loadPage(this.prevUrl);
    }
  }

  firstPage() {
    this.activePage = 1;
    if (this.firstUrl != null) {
      this.loadPage(this.firstUrl);
    }
  }

  lastPage() {
    this.activePage = this.lastPageNumber;
    if (this.lastUrl != null) {
      this.loadPage(this.lastUrl);
    }
  }

  sortBy(by: string | any): void {
    this.orderby = by;
    this.order_val = (this.order_val == null || this.order_val == 'asc') ? 'desc' : 'asc';
    this.activePage = 1;
    this.loadPage(this.url);
  }

  filterIt(arr: any, searchKey: any) {
    if (searchKey != null && searchKey != "") {
      this.filter = searchKey;
      this.loadPage(this.url);
    }
  }

  search() {
    return this.tableData;
  }
}