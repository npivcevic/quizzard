import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  count=0
  constructor(public inject: Injector, public router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: { Authorization: "bearer " + localStorage.getItem("token") }
    })
    return next.handle(request).pipe(catchError((e) => {
      let servis = this.inject.get(AuthService);
      if (e.status === 401 && this.count != 1) {
        this.count++
        return servis.generateRefreshToken().pipe(
          switchMap((res: any) => {
            localStorage.setItem("token", res.token)
            return next.handle(request.clone({
              setHeaders: { Authorization: `bearer ${res.token}` }
            }))
          })
        )
      }
      this.count = 0;
      this.router.navigate(['']);
      return throwError(() => new Error(e.message));
    }))

  }

}
