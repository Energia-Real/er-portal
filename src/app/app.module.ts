import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory function for ngx-translate
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
import { ServiceWorkerModule } from '@angular/service-worker';
import { catalogsReducer } from './core/store/reducers/catalogs.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CatalogEffects } from './core/store/effects/catalogs.effects';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        AppRoutingModule,
        GoogleMapsModule,
        CoreModule,
        CarouselModule,
        TranslateModule.forRoot({
            defaultLanguage: 'es-MX',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        StoreModule.forRoot({ 
            paginator: paginatorReducer, 
            drawer: drawerReducer, 
            filters: filterReducer, 
            notifications: notificationsReducer, 
            corporateDrawer: corporateDrawerReducer,
            catalogs: catalogsReducer 
        }),
        EffectsModule.forRoot([CatalogEffects]),

      ], providers: [
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
        ]
})
export class AppModule { }
