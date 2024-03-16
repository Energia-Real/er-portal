// token.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { AccountService } from '@app/_services/account.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accountService = inject(AccountService);
    if (request.url.startsWith(environment.API_URL_ASSETS_V1)) {
      
      const user = accountService.userValue;
  
      if (user?.token) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
  
        return next.handle(clonedRequest);
      } else {
        return next.handle(request);
      }
    }
    return next.handle(request);
  }
}
