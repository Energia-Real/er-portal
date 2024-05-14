import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent implements OnDestroy {
  loading = false;
  private subscription: Subscription;

  constructor(private loadingService: LoadingService) {
    this.subscription = this.loadingService.loading$.subscribe(
      (status) => {
        this.loading = status;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}