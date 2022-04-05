import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistDetailRoutingModule } from './playlist-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { TodoFormComponent } from 'src/app/modals/todo-form/todo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoCardComponent } from './todo-card/todo-card.component';


@NgModule({
  declarations: [
    PlaylistDetailComponent,
    TodoFormComponent,
    TodoCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    PlaylistDetailRoutingModule
  ],
  exports: [TodoCardComponent]
})
export class PlaylistDetailModule { }
