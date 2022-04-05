import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from './models/user';
import { UserService } from './services/auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private menu: MenuController) {}

  ngOnInit(): void {
    // enabling/disabling menu when on innit and depending of user auth status
    this.userService.onUserLoginChanges.subscribe((isLogged) => {
      this.menu.enable(isLogged, 'main');
      this.currentUser = this.userService.user;
    });
  }

  async logout(): Promise<void> {
    // waiting for logout
    await this.userService.logout();
  }
}
