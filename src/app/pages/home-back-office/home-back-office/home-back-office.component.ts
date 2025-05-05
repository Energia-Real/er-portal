import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-back-office',
    templateUrl: './home-back-office.component.html',
    styleUrl: './home-back-office.component.scss',
    standalone: false
})
export class HomeBackOfficeComponent implements OnInit{

  ngOnInit(): void {
    console.log("enBKhOme")
  }

}
