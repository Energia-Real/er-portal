import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './shared/interceptor/token.interceptor';
import { SharedComponensModule } from './shared/components/shared-components.module';
import { LoadingInterceptor } from './core/services/loading.interceptor';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { paginatorReducer } from './core/store/reducers/paginator.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { GoogleMapsModule } from '@angular/google-maps';
import { corporateDrawerReducer, drawerReducer } from './core/store/reducers/drawer.reducer';
import { filterReducer } from './core/store/reducers/filters.reducer';
import { notificationsReducer } from './core/store/reducers/notifications.reducer';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPaginatorIntl } from './shared/material/paginator-intl';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        GoogleMapsModule,
        CoreModule,
        CarouselModule,
        StoreModule.forRoot({ paginator: paginatorReducer, drawer: drawerReducer, filters: filterReducer, notifications: notificationsReducer, corporateDrawer: corporateDrawerReducer }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : []], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
            provide: MatPaginatorIntl,
            useValue: getPaginatorIntl()
        },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
