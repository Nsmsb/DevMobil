import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaylistFormComponent } from '../modals/playlist-form/playlist-form.component';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist/playlist.service';
import { EMPTY, Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/auth/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  playlists$: Observable<Playlist[]> = EMPTY;
  todayItems: Observable<Todo[]> = EMPTY;
  readonly slideOpt = {
    direction: 'horizontal',
    slidesPerView: 1.25,
    pagination: {
      el: '.swiper-pagination',
    }
  };
  
  
  constructor(private playlistService: PlaylistService,
    private userService: UserService,
    private modalController: ModalController,
    ) {}
    
  readonly currentUser: User = this.userService.user;

  ngOnInit(): void {
    this.playlists$ = this.playlistService.getAll();
    this.todayItems = this.playlistService.getOne('ZKLXgN561Se9GBtAstzw').pipe(switchMap(playlis => playlis.todos$));
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

  delete(playlist: Playlist) {
    this.playlistService.removePlaylist(playlist);
  }

  async openModal() {
    // TODO: complete CreatePlaylistComponent and change logic
    const modal = await this.modalController.create({
      component: PlaylistFormComponent
    });
    await modal.present();
  }

}
