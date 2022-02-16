import { Injectable } from "@angular/core";
import { Todo } from "./todo";

@Injectable()
export class List {

  public todos : Todo[];
  public name;

  constructor(name) {

    this.todos=[];
    this.todos.push(new Todo("todo" ,false , 12))
    this.name=name;

  }
}
