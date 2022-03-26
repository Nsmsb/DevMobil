import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class CreateTodoComponent implements OnInit {

  @Input() playlistId: string;
  @Input() todo: Todo;

  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController,
    private playlistService: PlaylistService) {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    if (this.todo) {
      this.todoForm.setValue({
        name: this.todo.name,
        description: this.todo.description
      });
    }
  }

  saveItem() {
    const newTodo: Todo = {
      completed: false,
      priority: 0,
      playlistId: this.playlistId,
      ...this.todo,
      ...this.todoForm.value,
    };

    if (this.todo)
      this.playlistService.updateTodo(this.playlistId, newTodo);
    else
      this.playlistService.addTodo(this.playlistId, newTodo);
    this.modalController.dismiss();
  }

}
