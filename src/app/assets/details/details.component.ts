import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{

  @Input() assetData: any;
  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;

  constructor(private sanitizer: DomSanitizer){
  }

  ngOnInit() {
    setTimeout(()=>{
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?key=AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k&center=' + this.assetData.latitude + ',' + this.assetData.longitude + '&zoom=18&maptype=satellite');
      this.loaderMap = false;
    }, 100)
  }

}
