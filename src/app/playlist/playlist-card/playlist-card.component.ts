import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
})
export class PlaylistCardComponent implements OnInit {
  
  @Input() playlist: Playlist;
  readonly slideOpt = {
    direction: 'vertical',
    slidesPerView: 2,
    pagination: {
      el: '.swiper-pagination',
    }
  }

  constructor() { }

  ngOnInit() {}

}
