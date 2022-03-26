import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateTodoComponent } from 'src/app/modals/todo-form/todo-form.component';
import { Playlist } from 'src/app/models/playlist';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist$: Observable<Playlist>;
  public currentStateMessage: string = 'Loadign playlist..';

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private modalController: ModalController) { }

  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    this.playlist$.subscribe((playlist) => {        
      if (!playlist) {
        this.currentStateMessage = 'Sorry, we couldn\!t find this playlist !';
      }
    });
  }

  /**
   * trackBy function to track rendered elements, and prevent angular from rendering all elements on change.
   * @param index item index
   * @param item item
   * @returns 
   */
  trackFunction(index: number, item: Todo):string {
    return item.id
  }

  delete(todo: Todo) {
    this.playlistService.removeTodo(this.route.snapshot.params.id, todo);
  }

  async update(todo: Todo): Promise<void> {
    const newTodo = await this.openModal(todo);
    this.playlistService.updateTodo(this.route.snapshot.params.id, newTodo);
  }

  async changeCompleted(todo: Todo): Promise<void> {
    // immediately update todo
    todo.completed = !todo.completed;
    // send update to backend
    this.playlistService.updateTodo(this.route.snapshot.params.id, {id: todo.id, completed: todo.completed});
  }

  async creat() {
    const newTodo = await this.openModal();
    this.playlistService.addTodo(this.route.snapshot.params.id, newTodo as Todo);
  }

  private async openModal(todo: Todo = null): Promise<Partial<Todo>> {    
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      swipeToClose: true, // swipe to close modal
      componentProps: {
        playlistId: this.route.snapshot.params.id,
        todo: todo 
      }
    });

    
    await modal.present();
    return (await (modal.onDidDismiss()))?.data;
  }

}
