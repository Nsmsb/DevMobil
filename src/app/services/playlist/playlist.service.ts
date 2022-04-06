import { Injectable } from '@angular/core';
import { Playlist } from '../../models/playlist';
import { Todo } from '../../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: Observable<Playlist[]> = of([]);
  playlistCollection: AngularFirestoreCollection<Playlist>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.playlistCollection = this.afs.collection<Playlist>('playlists', ref => ref.where(`roles.${authService.user?.id}`, '>=', 1));
    this.playlists = this.playlistCollection.valueChanges({idField: 'id'})
      .pipe(switchMap(playlists => {
        return of(playlists.map(
          playlist => ({
            ...playlist,
            myRole: playlist.roles[this.authService.user.id],
            todos$: this.getTodos(playlist.id)
          })
        ));
      }));
  }

  updateRoles(playlistId: string, roles: {[uid: string]: number}): void {
    this.playlistCollection.doc(playlistId).update({
      roles
    });
  }

  getAll(): Observable<Playlist[]> {
    return this.playlists.pipe(
      switchMap(playlists => {
      return of(playlists.map(
        playlist => {
          const myRole = playlist.roles[this.authService.user.id];
          return {
          ...playlist,
          myRole: myRole,
          todos$: this.getTodos(playlist.id).pipe(map(todos => todos.map(todo => ({...todo, disabled: myRole === 1}))))
        };
      }
      ));
    }));
  }

  getOne(id: string): Observable<Playlist> {
    return this.playlists.pipe(
      switchMap(playlists => {
        const playlist = playlists.find(playlist => playlist.id === id);
        return of(playlist);
      }));
  }

  private getTodos(playlistId: string): Observable<Todo[]> {
    return this.afs.collection<Todo>(`playlists/${playlistId}/todos`)
      .valueChanges({idField: 'id'});
  }

  addPlaylist(playlist: Playlist): Promise<void> {
    const roles = {};
    roles[this.authService.user.id] = 7;
    return this.playlistCollection.add({
      ...playlist,
      owner: this.authService.user.name,
      roles: roles
    })
    // return a void promise to enable user (dev) to wait for result or handle error
    .then();
  }

  removePlaylist(playlist: Playlist): Promise<void> {
    return this.playlistCollection.doc(playlist.id).delete();
  }

  updatePlaylist(playlist: Partial<Playlist>): Promise<void> {
    // deleting id field
    const newPlaylist = {...playlist};
    delete newPlaylist['id'];
    delete newPlaylist['todos$'];
    // updating playlist
    return this.playlistCollection.doc(playlist.id).update(newPlaylist);
  }

  addTodo(playlistId: string, todo: Todo): Promise<void> {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.add({
      ...todo,
      playlistId: playlistId
    })
    // return a void promise to enable user to wait for result or handle error
    .then();
  }

  updateTodo(playlistId: string, todo: Partial<Todo>): Promise<void> {
    // deleting id field
    const newTodo = {...todo};
    delete newTodo['id'];
    // updating component
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.doc(todo.id).update(newTodo);
  }

  removeTodo(playlistId: string, todo: Todo): Promise<void> {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.doc(todo.id).delete();
  }
}
