import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
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
    if (newTodo)
      this.playlistService.updateTodo(this.route.snapshot.params.id, newTodo);
  }

  async changeCompleted(todo: Todo): Promise<void> {
    // immediately update todo
    todo.completed = !todo.completed;
    // send update to backend
    this.playlistService.updateTodo(this.route.snapshot.params.id, {id: todo.id, completed: todo.completed});
  }

  async create() {
    const newTodo = await this.openModal();
    if (newTodo)
      this.playlistService.addTodo(this.route.snapshot.params.id, newTodo as Todo);
  }

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

  async deletePlaylist(playlist: Playlist) {
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
    if (answer) {
      this.playlistService.removePlaylist(playlist);
      this.router.navigate(['playlist']);
    }
    
  }

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
