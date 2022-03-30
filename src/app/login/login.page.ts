import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loginForm: FormGroup;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private userService: UserService, private router: Router) { 
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.minLength(3)]],
      mdp: ['', Validators.maxLength(255)],
    });
  }

  ngOnInit() {
  }


  async connexion() {
    try{
      const connectedUserCredentails = await this.afAuth.signInWithEmailAndPassword(this.loginForm.value.mail, this.loginForm.value.mdp);

      //TODO : Valider la connexion
      this.userService.setuser(connectedUserCredentails.user.email, connectedUserCredentails.user.uid);
      this.router.navigate(['/']);
    }catch(error){
      alert("identifiant non reconnue");
    }

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
