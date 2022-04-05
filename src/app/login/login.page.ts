import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  async login(): Promise<void> {
    try {
      await this.authService.login();
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }
}
