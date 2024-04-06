import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  public routeActive: string;
  constructor(private router: Router) {
    this.routeActive = this.router.url;
  }
  
  ngOnInit(): void {
  }
}
