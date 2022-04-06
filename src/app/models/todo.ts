import { Priority } from "./priority";

export interface Todo {
    id: string;
    name: string;
    priority: Priority;
    description: string;
    completed: boolean;
    playlistId: string;
    disabled?: boolean;
}
