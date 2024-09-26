import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './shared/interceptor/token.interceptor';
import { SharedComponensModule } from './shared/components/header/shared-components.module';
import { LoadingInterceptor } from './core/services/loading.interceptor';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { paginatorReducer } from './core/store/reducers/paginator.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { GoogleMapsModule } from '@angular/google-maps';
import { drawerReducer } from './core/store/reducers/drawer.reducer';
import { filterReducer } from './core/store/reducers/filters.reducer';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedComponensModule,
    GoogleMapsModule,
    CoreModule,
    StoreModule.forRoot({ paginator: paginatorReducer , drawer: drawerReducer, filters:filterReducer }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
  ],
  providers: [
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
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
