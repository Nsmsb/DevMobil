import { Observable, of } from "rxjs";
import { Todo } from "./todo";

export interface Playlist {
    id: string;
    name: string;
    todos$: Observable<Todo[]>;
    style: string;
    owner?: string;
    myRole?: number;
    roles?: {[uid: string]: number};
}

