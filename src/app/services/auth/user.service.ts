import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { User } from '../../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private connectedUser: User;

  constructor(private auth: AngularFireAuth) {
    this.connectedUser = JSON.parse(localStorage.getItem('user'));
    auth.onAuthStateChanged((user) => {      
      if (!user) {
        localStorage.removeItem('user');
        return
      }
      
      this.connectedUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName
      }
      localStorage.setItem('user', JSON.stringify(this.connectedUser));
    })
  }

  get user() {
    return this.connectedUser;
  }

  setuser(mail, id) {
    this.user.email = mail;
    this.user.id = id;
  }

  isLogged(): boolean {    
    if (!this.connectedUser) {
      return false
    }
    return true;
  }

  async signUp() {
    const newUserCredentails = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if (newUserCredentails.additionalUserInfo.isNewUser) {
      newUserCredentails.user.sendEmailVerification();
    }
    this.auth.signOut();
  }

  async removeUser() {
    // TODO
  }

  async login(): Promise<void> {
    const connectedUserCredentails = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    
    if (!connectedUserCredentails.user.emailVerified) {
      // TODO: use emailVerified as part of a guard
      this.auth.signOut();
      return
    }
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
