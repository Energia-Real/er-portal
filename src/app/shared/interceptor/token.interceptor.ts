// token.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { AuthService } from '@app/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accountService = inject(AuthService);
    if (request.url.startsWith(environment.API_URL_CLIENTS_V1) || request.url.startsWith(environment.API_URL_EQUIPMENTS_V1) || request.url.startsWith(environment.API_URL_BATU_V1) || request.url.startsWith(environment.API_URL_EQUIPMENT_HUAWEI_V1)  || request.url.startsWith(environment.API_URL_ENERGY_PERFORMANCE_V1) || request.url.startsWith(environment.API_URL_BILL_V1)) {
      
      const user = accountService.userValue;
  
      if (user?.token) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`,
            AccessControlAllowOrigin: '*'
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
