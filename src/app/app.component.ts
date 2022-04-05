import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from './models/user';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  currentUser: User;

  constructor(private authService: AuthService, private menu: MenuController) {}

  ngOnInit(): void {
    // enabling/disabling menu when on innit and depending of user auth status
    this.authService.onUserLoginChanges.subscribe((isLogged) => {
      this.menu.enable(isLogged, 'main');
      this.currentUser = this.authService.user;
    });
  }

  async logout(): Promise<void> {
    // waiting for logout
    await this.authService.logout();
  }
}
