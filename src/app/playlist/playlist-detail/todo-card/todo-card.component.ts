import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent {

  @Input() todo: Todo;
  @Input() disabled: boolean = false;

  constructor(private playlistService: PlaylistService) { }

  async changeCompleted(todo: Todo): Promise<void> {
    // immediately update todo
    todo.completed = !todo.completed;
    // send update to backend
    this.playlistService.updateTodo(todo.playlistId, {id: todo.id, completed: todo.completed});
  }

}
