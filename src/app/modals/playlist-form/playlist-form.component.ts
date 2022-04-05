import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Playlist } from 'src/app/models/playlist';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss'],
})
export class PlaylistFormComponent implements OnInit {

  @Input() playlist: Playlist;
  playlistForm: FormGroup;

  constructor(private fb: FormBuilder, private playlistService: PlaylistService,
    private modalController: ModalController) {
    this.playlistForm = this.fb.group({ 
      name: ['', [Validators.required, Validators.minLength(3)]] ,
      style: ['blue', [Validators.required]] ,
    });
  }

  ngOnInit() {
    if (this.playlist) {
      this.playlistForm.setValue({
        name: this.playlist.name,
        style: this.playlist.style,
      });
    }
  }

  saveItem(): void {
    const newPlaylist:Partial<Playlist> = {
      ...this.playlist,
      ...this.playlistForm.value,
    };

    // return new data
    this.modalController.dismiss(newPlaylist);
  }


}
