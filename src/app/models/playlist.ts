import { Observable, of } from "rxjs";
import { Todo } from "./todo";

export interface Playlist {
    id: string;
    name: string;
    todos$: Observable<Todo[]>;
    roles?: {[uid: string]: number};

}

