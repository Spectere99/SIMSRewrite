import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthenticationService, private _router: Router) {
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this.performCheck(childRoute, state);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.performCheck(next, state);
  }

  private performCheck(next: ActivatedRouteSnapshot,
                       state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    // ('performCheck', this._authService.isAuthenticated());
    if (this._authService.isAuthenticated()) {
        return true;
      }

    this._authService.setRedirectUrl(state.url);
    this._authService.message = 'Please login to continue';
    this._authService.clear();

    this._router.navigate(['/Login']);
    return false;
                       }

}
