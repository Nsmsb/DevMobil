import { Injectable, OnInit } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FieldValue } from '@angular/fire/firestore/';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: Observable<Playlist[]> = of([]);
  playlistCollection: AngularFirestoreCollection<Playlist>;

  constructor(private afs: AngularFirestore) {
    this.playlistCollection = this.afs.collection<Playlist>('playlists');
    this.playlists = this.playlistCollection.valueChanges({idField: 'id'});
  }

  getAll() {
    return this.playlists;
  }

  getOne(id: string) {
    return this.playlists.pipe(
      switchMap(playlists => {
        const playlist = playlists.find(playlist => playlist.id === id);
        
        return of({
          ...playlist,
          todos$: this.getTodos(playlist.id)
        });
      }));
  }  

  private getTodos(playlistId: string): Observable<Todo[]> {
    return this.afs.collection<Todo>(`playlists/${playlistId}/todos`).valueChanges({idField: 'id'})
  }

  addPlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.concat(playlist);
  }

  removePlaylist(playlist: Playlist) {
    // this.playlists = this.playlists.filter(p => p.id !== playlist.id);
  }

  async addTodo(playlistId: string, todo: Todo) {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    todosCollection.add({
      ...todo,
      playlistId: playlistId
    });
  }

  removeTodo(playlistId: string, todo: Todo) {
    const todosCollection: AngularFirestoreCollection<Todo> = this.playlistCollection.doc(playlistId).collection('todos');
    todosCollection.doc(todo.id).delete();
  }
}
