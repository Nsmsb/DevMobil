import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loginForm: FormGroup;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth) { 
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.minLength(3)]],
      mdp: ['', Validators.maxLength(255)],
    });
  }

  ngOnInit() {
  }


  connexion() {
    const res = this.afAuth.signInWithEmailAndPassword(this.loginForm.value.mail, this.loginForm.value.mdp);

    //TODO : Valider la connexion
    res.then(data => console.log(data.user.metadata));

    //la connexion a échouer
    res.catch(error => alert("identifiant inconnue"))
  }

}
