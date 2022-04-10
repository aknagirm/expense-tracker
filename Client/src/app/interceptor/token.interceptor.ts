import { HttpInterceptor } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "../core/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req, next) {
    let auth = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getLocalStorageItem()}`,
      },
    });
    return next.handle(tokenizedReq);
  }
}
