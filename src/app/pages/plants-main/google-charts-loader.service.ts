import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartsLoaderService {

  private googleLoaded: boolean = false;

  constructor() { }

  public load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.googleLoaded) {
        this.googleLoaded = true;
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
