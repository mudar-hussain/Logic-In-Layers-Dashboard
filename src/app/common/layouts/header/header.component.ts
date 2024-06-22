import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userData: any = '';
  isLoggedIn$: Observable<boolean> | undefined;
  newsletterUrl: string = "#";
  isWindow: boolean = window.innerWidth > 770 ? true : false;

  constructor(private authService: AuthService, private configService: ConfigService) {}
  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user) this.userData = JSON.parse(user);

    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.newsletterUrl = this.configService.getNewsletterURL();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWindow = event.target.innerWidth > 770 ? true : false;
  }

  logout() {
    this.userData = null;
    this.authService.logout();
  }
}
