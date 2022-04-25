import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { tap } from 'rxjs';
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
      tap((event) => {
        if (
          event instanceof HttpResponse ||
          event instanceof HttpErrorResponse
        ) {
          this.loaderService.stopLoader();
        }
      })
    );
  }
}
