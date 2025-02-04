import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Priority } from 'src/app/models/priority';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {

  @Input() playlistId: string;
  @Input() todo: Todo;

  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController) {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(255)],
      priority: [Priority.LOW, Validators.required],
    });
  }

  ngOnInit(): void {
    // if an initial data is passed, then fill form
    if (this.todo) {
      this.todoForm.setValue({
        name: this.todo.name,
        description: this.todo.description,
        priority: this.todo.priority,
      });
    }
  }

  /**
   * method to dismiss modal and pass data
   */
  saveItem(): void {
    // excluding myRole and disabled fields
    const {myRole, disabled, ...formValue} = this.todoForm.value;
    
    // new value
    const newTodo: Todo = {
      completed: false,
      priority: Priority.LOW,
      playlistId: this.playlistId,
      ...this.todo,
      ...formValue,
    };

    // return new data
    this.modalController.dismiss(newTodo);
  }

}
