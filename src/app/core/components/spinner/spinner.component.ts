import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { Subscription } from 'rxjs';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnDestroy, AfterViewInit {
  loading = false;
  private subscription: Subscription;
  pathsArray: SVGPathElement[] = [];
  intervalId: any;
  currentIndex: number = 0;


  constructor(private loadingService: LoadingService) {
    this.subscription = this.loadingService.loading$.subscribe((status) => {
      this.loading = status;
      if (this.loading) {
        setTimeout(() => this.startAnimation(), 0);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.loading) {
      setTimeout(() => this.startAnimation(), 0);
    }
  }

  /* startAnimation() {
    const paths = document.querySelectorAll('#logo path');
    this.pathsArray = Array.from(paths) as SVGPathElement[];

    for (let i = 0; i < this.pathsArray.length-1; i++) {
      setTimeout(() => {
        anime({
          targets: this.pathsArray[i],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 100,
          delay: 0,
          direction: 'normal',
          loop: false
        });
      }, i * 100); 
    }
    setTimeout(() => {
      this.startAnimation.call(this);
    }, (this.pathsArray.length-1) * 100);
  
  }  */
    startAnimation() {
      const paths = document.querySelectorAll('#logo path');
      paths.forEach((path,index)=>{
        anime({
          targets: path,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 800,
          delay: 0,
          direction: 'normal',
          loop: true
        });
      })
     
    }
     
}
