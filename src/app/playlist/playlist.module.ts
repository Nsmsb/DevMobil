import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaylistPage } from './playlist.page';

import { PlaylistPageRoutingModule } from './playlist-routing.module';
import { PlaylistFormComponent } from '../modals/playlist-form/playlist-form.component';
import { PlaylistCardComponent } from './playlist-card/playlist-card.component';
import { PlaylistDetailModule } from './playlist-detail/playlist-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlaylistPageRoutingModule,
    PlaylistDetailModule
  ],
  declarations: [PlaylistPage, PlaylistFormComponent, PlaylistCardComponent]
})
export class PlaylistPageModule { }
