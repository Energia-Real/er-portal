import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateComponentsService {
  private updateSubject = new Subject<void>();

  updateEvent$ = this.updateSubject.asObservable();

  triggerUpdate() {
    this.updateSubject.next();
  }
}
