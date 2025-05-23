import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '@app/shared/material/material.module';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-message-no-data',
    templateUrl: './message-no-data.component.html',
    styleUrl: './message-no-data.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MaterialModule],
    standalone: true
})
export class MessageNoDataComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() message : string = '';
  @Input() type : string = 'line';
  
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
