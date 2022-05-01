import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { LoaderService } from '../core/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private loaderService: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loaderService.startLoader();
    let auth = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getLocalStorageItem()}`,
      },
    });
    return next.handle(tokenizedReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.loaderService.stopLoader();
          }
        },
        error: (event) => {
          if (event instanceof HttpErrorResponse) {
            this.loaderService.resetLoader();
          }
        },
      })
    );
  }
}
