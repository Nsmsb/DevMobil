import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateTodoComponent } from 'src/app/modals/create-todo/create-todo.component';
import { Playlist } from 'src/app/models/playlist';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist$: Observable<Playlist>;

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private modalController: ModalController) { }

  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);

    this.playlist$.subscribe(console.log);
  }

  delete(todo: Todo) {
    this.playlistService.removeTodo(+this.route.snapshot.params.id, todo);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      componentProps: {
        playlistId: this.route.snapshot.params.id
      }
    });
    // const newTodo = (await modal.onDidDismiss()).data;
    await modal.present();
    this.modalController.
    // console.log(newTodo);
    // this.playlist = this.playlistService.getOne(+this.route.snapshot.params.id);
  }

}
