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

  startAnimation() {
    anime({
      targets: '#logo ',
      translateX: {
        value: 150,
        duration: 300
      },
      rotate: {
        value: 360,
        duration: 800,
        easing: 'easeInOutSine'
      },
      scale: {
        value: 2,
        duration: 1800,
        delay: 800,
        easing: 'easeInOutQuart'
      },
      delay: 250 
    });
  }
}
