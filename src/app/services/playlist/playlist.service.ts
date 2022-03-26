import { Injectable } from '@angular/core';
import { Playlist } from '../../models/playlist';
import { Todo } from '../../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../auth/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: Observable<Playlist[]> = of([]);
  playlistCollection: AngularFirestoreCollection<Playlist>;

  constructor(private afs: AngularFirestore, private userService: UserService) {
    this.playlistCollection = this.afs.collection<Playlist>('playlists', ref => ref.where(`roles.${userService.user?.id}`, '>', 1));
    this.playlists = this.playlistCollection.valueChanges({idField: 'id'});
  }

  getAll(): Observable<Playlist[]> {
    return this.playlists;
  }

  getOne(id: string): Observable<Playlist> {
    return this.playlists.pipe(
      switchMap(playlists => {
        const playlist = playlists.find(playlist => playlist.id === id);
        if (playlist === undefined) {
          return of(null);
        }
        return of({
          ...playlist,
          todos$: this.getTodos(playlist?.id)
        });
      }));
  }  

  private getTodos(playlistId: string): Observable<Todo[]> {
    return this.afs.collection<Todo>(`playlists/${playlistId}/todos`).valueChanges({idField: 'id'})
  }

  addPlaylist(playlist: Playlist): Promise<void> {
    const roles = {};
    roles[this.userService.user.id] = 7;
    return this.playlistCollection.add({
      ...playlist,
      roles: roles
    })
    // return a void promise to enable user to wait for result or handle error
    .then();
  }

  removePlaylist(playlist: Playlist): Promise<void> {
    return this.playlistCollection.doc(playlist.id).delete();
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
