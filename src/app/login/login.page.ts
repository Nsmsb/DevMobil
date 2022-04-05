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

      if(!connectedUserCredentails.user.emailVerified){
        alert("vous n'avez pas encore valider votre email, valider le pour vous connectez.");
        return;
      }
      
      this.userService.setuser("teste", connectedUserCredentails.user.uid);
      this.router.navigate(['/']);
    }catch(error){
      alert("identifiant non reconnue");
      console.log(error);
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
