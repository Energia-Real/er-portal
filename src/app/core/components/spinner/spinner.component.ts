import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import anime from 'animejs/lib/anime.es.js';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: false
})
export class SpinnerComponent implements OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  loading: boolean = false;
  pathsArray: SVGPathElement[] = [];
  intervalId: any;
  currentIndex: number = 0;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.pipe(takeUntil(this.onDestroy$)).subscribe((status) => {
      this.loading = status;
      if (this.loading) {
        setTimeout(() => this.startAnimation(), 0);
      }
    });
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
    paths.forEach((path, index) => {
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
