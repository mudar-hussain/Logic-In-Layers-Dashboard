import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  isLoggedInGaurd: boolean = false;

  constructor(private firebaseAuth: Auth, private toastr: ToastrService, private router: Router) { }

  register(email: string, username:string, password:string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
                      .then((response) =>
                        updateProfile(response.user, {displayName: username}),
                      );
    return from(promise);
  }

  login(email: string, password:string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGaurd = true;
      this.toastr.success("Logged in Sucessfully");
      this.router.navigate(['/']);
    }).catch(error => {
      this.toastr.warning("Invalid username or password");
      throw new Error(error);
    });
    return from(promise);
  }

  loadUser() {
    const userData = JSON.stringify(this.firebaseAuth.currentUser);
    sessionStorage.setItem('user', userData);
  }

  logout() {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
      this.loggedIn.next(false);
      this.isLoggedInGaurd = false;
      this.toastr.success("Logged out Sucessfully");
      this.router.navigate(['/login']);
    }).catch(error => {
      throw new Error(error);
    });
    return from(promise);
  }

  isLoggedIn(){
    return this.loggedIn.asObservable();
  }
}
