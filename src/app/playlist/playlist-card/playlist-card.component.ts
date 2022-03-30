import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playlist } from 'src/app/models/playlist';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
})
export class PlaylistCardComponent implements OnInit{

  @Input() playlist: Playlist;
  progress$: Observable<{completed: number, all: number}>;
  prioritaryTodos$: Observable<Todo[]>;

  constructor() { }

  ngOnInit() {
    // creating an observable that calculate progress/top-todos on each change
    this.progress$ = this.playlist.todos$.pipe(map(todos => ({completed: todos.filter(todo => todo.completed).length, all: todos.length})));
    this.prioritaryTodos$ = this.playlist.todos$.pipe(map(todos => todos.slice(0, 4)));
  }

}
