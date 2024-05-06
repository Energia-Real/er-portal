import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-return-bar',
  templateUrl: './return-bar.component.html',
  styleUrls: ['./return-bar.component.scss']
})
export class ReturnBarComponent {
  @Input() title: string = "";

  constructor(
    private router: Router,
    private location: Location
  ){}

  returnTo(){
   this.location.back();
  }
}
