import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistFormComponent } from 'src/app/modals/playlist-form/playlist-form.component';
import { TodoFormComponent } from 'src/app/modals/todo-form/todo-form.component';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private modalController: ModalController,
    private alertController: AlertController,
    ) { }

  progress$: Observable<{completed: number, all: number}>;


  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    // creating progress observable
    firstValueFrom(this.playlist$).then((playlist) => {
      this.progress$ = playlist.todos$.pipe(map(todos => ({completed: todos.filter(todo => todo.completed).length, all: todos.length})));
    });
  }

  /**
   * trackBy function to track rendered elements, and prevent angular from rendering all elements on change.
   * @param index item index
   * @param item item
   * @returns item id
   */
  trackFunction(index: number, item: Todo):string {
    return item.id
  }

  /**
   * delete a todo
   * @param todo todo to delete
   */
  delete(todo: Todo) {
    this.playlistService.removeTodo(this.route.snapshot.params.id, todo.id);
  }

  /**
   * update a todo by calling a form modal to update todo
   * @param todo to update
   */
  async update(todo: Todo): Promise<void> {
    // opening modal and waiting for new data
    const newTodo = await this.openModal(todo);
    // if modal is successfully dismissed update item
    if (newTodo)
      this.playlistService.updateTodo(this.route.snapshot.params.id, newTodo);    
  }

  /**
   * change completed state of a todo item
   * @param todo concerned todo
   */
  async changeCompleted(todo: Todo): Promise<void> {
    // immediately update todo
    todo.completed = !todo.completed;
    // send update to backend
    this.playlistService.updateTodo(this.route.snapshot.params.id, {id: todo.id, completed: todo.completed});
  }

  /**
   * ask data from user to create a new todo item 
   */
  async create() {
    // opening modal and waiting for data
    const newTodo = await this.openModal();
    // if modal is successfully dismissed then create item
    if (newTodo)
      this.playlistService.addTodo(this.route.snapshot.params.id, newTodo as Todo);
  }

  /**
   * edite meta data of a playlist
   * @param playlist to edit
   */
  async edit(playlist: Playlist) {
    const modal = await this.modalController.create({
      component: PlaylistFormComponent,
      cssClass: 'modal',
      swipeToClose: true, // swipe to close modal
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5],

      componentProps: {
        playlist: playlist,
      }
    });
    // waiting for modal
    await modal.present();
    const newPlaylist = (await modal.onDidDismiss())?.data;
    //  if modal is not aborted
    if (newPlaylist) {
      this.playlistService.updatePlaylist(newPlaylist);
    }
  }

  /**
   * open modal to share a playlist
   * @param playlist to share
   * @param roles new roles
   */
  sharePlaylist(playlist: Playlist): void {
    // TODO
    const roles = {};
    roles['I5Gmxv0vV9aVrOyIs5N0FpLETa43'] = 10;
    this.playlistService.updateRoles(playlist.id, roles);
  }

  /**
   * delete playlist by asking confirmation from user
   * @param playlist to delete
   */
  async deletePlaylist(playlist: Playlist) {
    // creating confirmation modal
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Do you want to delete <strong>${playlist.name}</strong> playlist ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Continue',
          role: 'continue',
          id: 'confirm-button',
        }
      ]
    });
    // waiting for confirmation
    await alert.present();
    const answer = (await alert.onDidDismiss())?.role === 'continue';
    // delete playlist on confirmation
    if (answer) {
      this.playlistService.removePlaylist(playlist.id);
      this.router.navigate(['playlist']);
    }
  }

  /**
   * method to get data (todo) from user by opening a modal
   * @param todo object, if not null modal is pre-filled
   * @returns todo raw data entered by user
   */
  private async openModal(todo: Todo = null): Promise<Partial<Todo>> {    
    const modal = await this.modalController.create({
      component: TodoFormComponent,
      cssClass: 'modal',
      swipeToClose: true, // swipe to close modal
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7],

      componentProps: {
        playlistId: this.route.snapshot.params.id,
        todo: todo 
      }
    });
    // waiting for modal
    await modal.present();
    return (await (modal.onDidDismiss()))?.data;
  }

}
