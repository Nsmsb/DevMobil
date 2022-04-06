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
    // storing playlists collection to be used in requests
    this.playlistCollection = this.afs.collection<Playlist>('playlists', ref => ref.where(`roles.${authService.user?.id}`, '>=', 1));
    // storing playlists observables to avoid sending requests each time
    this.playlists = this.playlistCollection.valueChanges({idField: 'id'})
      .pipe(switchMap(playlists => {      // mapping playlists to make todos in separated observables
        return of(playlists.map(
          playlist => {
            const myRole = playlist.roles[this.authService.user.id];
            return {
            ...playlist,
            myRole: playlist.roles[this.authService.user.id],
            todos$: this.getTodos(playlist.id)
              .pipe(map(todos => todos
                // mapping todos to add extra informations
                .map(todo => ({...todo, disabled: myRole === 1})
              )))
          };
        }
        ));
      }));
  }

  updateRoles(playlistId: string, roles: {[uid: string]: number}): void {
    // TODO: create users collection to track email/ids
    this.playlistCollection.doc(playlistId).update({
      roles
    });
  }

  /**
   * get All playlists accessible by user
   * @returns observables array of playlists
   */
  getAll(): Observable<Playlist[]> {
    return this.playlists;
  }

  /**
   * get a single playlist by id
   * @param id playlist id
   * @returns observable of playlist updates in realtime
   */
  getOne(id: string): Observable<Playlist> {
    // using stored playlists object to get it
    return this.playlists.pipe(
      switchMap(playlists => {
        const playlist = playlists.find(playlist => playlist.id === id);
        return of(playlist);
      }));
  }

  /**
   * get all todo items of a playlist
   * @param playlistId playlist id
   * @returns observable of a Todo array
   */
  private getTodos(playlistId: string): Observable<Todo[]> {
    return this.afs.collection<Todo>(`playlists/${playlistId}/todos`)
      .valueChanges({idField: 'id'});
  }

  /**
   * add new playlist
   * @param playlist object
   * @returns promise resolved when the playlist is created
   */
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

  /**
   * deleted a playlist by id
   * @param playlistId playlist id 
   * @returns a promise that resolves when the playlist is removed
   */
  removePlaylist(playlistId: string): Promise<void> {
    return this.playlistCollection.doc(playlistId).delete();
  }

  /**
   * update a playlist
   * @param playlist Partial object of a playlist to update only specific fields
   * @returns a promise that resolves when playlist is updated
   */
  updatePlaylist(playlist: Partial<Playlist>): Promise<void> {
    // deleting id field
    const newPlaylist = {...playlist};
    delete newPlaylist['id'];
    delete newPlaylist['todos$'];
    // updating playlist
    return this.playlistCollection.doc(playlist.id).update(newPlaylist);
  }

  /**
   * add new todo task to a playlist
   * @param playlistId id if playlist where you want to add todo
   * @param todo object to add
   * @returns promise resolved when item is added to playlist
   */
  addTodo(playlistId: string, todo: Todo): Promise<void> {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.add({
      ...todo,
      playlistId: playlistId
    })
    // return a void promise to enable user to wait for result or handle error
    .then();
  }

  /**
   * update a todo task
   * @param playlistId where todo exists
   * @param todo partial todo
   * @returns promise resolved when todo is updated
   */
  updateTodo(playlistId: string, todo: Partial<Todo>): Promise<void> {
    // deleting id field
    const newTodo = {...todo};
    delete newTodo['id'];
    // updating component
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.doc(todo.id).update(newTodo);
  }

  /**
   * remove a todo item
   * @param playlistId id if playlist that contains the todo item
   * @param todoId id of todo to delete
   * @returns a promise resolved when todo is deleted
   */
  removeTodo(playlistId: string, todoId: string): Promise<void> {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    return todosCollection.doc(todoId).delete();
  }
}
