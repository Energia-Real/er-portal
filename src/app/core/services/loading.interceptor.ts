import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environment/environment';
import { Store } from '@ngrx/store';
import { NotificationService } from '@app/shared/services/notification.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (this.activeRequests === 0) {
      this.loadingService.show();
    }
    if( !req.url.includes(environment.API_URL_NOTIFICATIONS)){
      this.activeRequests++;
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['']);
          this.snackBar.open('Sesión expirada. Por favor, inicia sesión nuevamente.', 'Cerrar', {
            duration: 15000,
          });
        }
        return throwError(error);
      }),
      finalize(() => {
        if( !req.url.includes(environment.API_URL_NOTIFICATIONS)){
          this.activeRequests--;
        }
    
        if (this.activeRequests === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}
