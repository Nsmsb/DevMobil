import { Injectable } from '@angular/core';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  

  private todoList: List[];

  constructor() {
    this.todoList=[];
    this.todoList.push(new List("item 1"));
    this.todoList.push(new List("item 2"));
    this.todoList.push(new List("item 3"));
    this.todoList.push(new List("item 4"));
  }

  public getAll(){
    return this.todoList;
  }

  public getOne(id){
    return this.getOne(id);
  }

  create(name){
    this.todoList.push(new List(name));
  }

  delete(i: number) {
    this.todoList.splice(i,1);
  }

}
