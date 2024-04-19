import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-bar',
  templateUrl: './return-bar.component.html',
  styleUrls: ['./return-bar.component.scss']
})
export class ReturnBarComponent {
  @Input() urlToGo: string = "";
  @Input() title: string = "";

  constructor(private router: Router){}

  returnTo(){
    this.router.navigate([this.urlToGo]);
  }
}
