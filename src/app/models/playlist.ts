import { Observable, of } from "rxjs";
import { Todo } from "./todo";

export interface Playlist {
    id: string;
    name: string;
    todos$: Observable<Todo[]>;
    style: string;
    roles?: {[uid: string]: number};

}

