import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  isLogged(): boolean {
    return this.userService.isLogged();
  }

  async login(): Promise<void> {
    try {
      await this.userService.login();
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
      
    }


  }

  async logout(): Promise<void> {
    await this.userService.logout();
  }
}
