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

  constructor(private loadingService: LoadingService) {
    this.subscription = this.loadingService.loading$.subscribe((status) => {
      this.loading = status;
      /*if (this.loading) {
        setTimeout(() => this.startAnimation(), 0);
      }*/
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    /*if (this.loading) {
      setTimeout(() => this.startAnimation(), 0);
    */
  }

  /*startAnimation() {
    anime({
      targets: '  path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(el, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    });
  }*/
}
