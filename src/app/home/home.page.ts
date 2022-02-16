import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

  public listTodo: List[];

  constructor(private listService: ListService) {
  }


  ngOnInit(): void {
    this.listTodo=this.listService.getAll();
  }

  delete(i:number){
    this.listService.delete(i);
    this.listTodo=this.listService.getAll();
  }

  addTodo(){
    this.listService.create(name);
  }

}
