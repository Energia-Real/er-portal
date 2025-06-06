import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-return-bar',
    templateUrl: './return-bar.component.html',
    styleUrls: ['./return-bar.component.scss'],
    standalone: false
})
export class ReturnBarComponent {
  @Input() title: string = "";

  constructor(
    private location: Location
  ) { }

  returnTo() {
     this.location.back();
  }
}
