import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePlaylistComponent } from '../modals/create-playlist/create-playlist.component';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist/playlist.service';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { filter, map, mapTo, switchMap, toArray } from 'rxjs/operators';

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
  }

  constructor(private playlistService: PlaylistService,
    private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.playlists$ = this.playlistService.getAll();
    this.todayItems = this.playlistService.getOne('ZKLXgN561Se9GBtAstzw').pipe(switchMap(playlis => playlis.todos$));
  }

  delete(playlist: Playlist) {
    this.playlistService.removePlaylist(playlist);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreatePlaylistComponent
    });
    await modal.present();
    // this.playlists = this.playlistService.getAll();
  }

}
