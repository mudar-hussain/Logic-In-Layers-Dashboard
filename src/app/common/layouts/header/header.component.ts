import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  userData: any = '';
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(private authService: AuthService){}
  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user) this.userData = JSON.parse(user);
    
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logout() {
    this.userData = null;
    this.authService.logout();
  }
}
