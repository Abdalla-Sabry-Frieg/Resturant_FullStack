import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/auth-interceptor.service';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes) ,
          provideHttpClient(withInterceptors([tokenInterceptor])) ,
          provideToastr(
            {timeOut: 3000,
            positionClass: 'toast-top-right',  // Top right position
            preventDuplicates: true,}
          )

        ]
};
