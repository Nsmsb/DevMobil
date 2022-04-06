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

  async signUp(): Promise<void> {
      await this.authService.signUp();
      alert('Thankyou for sign up, a verification mail is sent, please verify your account to use tha app');
  }

  async login(): Promise<void> {
    try {
      await this.authService.login();
      this.router.navigate(['/']);
    } catch (error) {
      alert('Ivalid user informations and accoun deosn\'t exists.')
    }
  }
}
