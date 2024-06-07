import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '@app/shared/material/material.module';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-message-no-data',
  templateUrl: './message-no-data.component.html',
  styleUrl: './message-no-data.component.scss',
  standalone   : true,
  encapsulation: ViewEncapsulation.None,
  imports      : [CommonModule, NgIf, MaterialModule, NgClass]
})
export class MessageNoDataComponent implements OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() message : string = '';
  
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
