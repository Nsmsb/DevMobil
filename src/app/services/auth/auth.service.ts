import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { map, Observable, Subject } from 'rxjs';
import { User } from '../../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private connectedUser: User;
  private userLoginChangesSubject: Subject<boolean>;

  constructor(private auth: AngularFireAuth, private router: Router) {
    // creating subject
    this.userLoginChangesSubject = new Subject();
    // getting user info from localstorage
    this.connectedUser = JSON.parse(localStorage.getItem('user'));

    // subscribing to changes, and updating local cache to make sure user is always authenticated
    auth.onAuthStateChanged((user) => {      
      if (!user) {
        localStorage.removeItem('user');
        router.navigate(['/login']);
        // notify subject
        this.userLoginChangesSubject.next(false);
        return
      }
      
      // updating connected user
      this.connectedUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        picture: user.photoURL,
      }
      localStorage.setItem('user', JSON.stringify(this.connectedUser));
      // notify subject
      this.userLoginChangesSubject.next(true);
    });

  }

  get user() {
    return this.connectedUser;
  }

  get onUserLoginChanges() {
    return this.userLoginChangesSubject.asObservable();
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
