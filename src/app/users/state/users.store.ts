import { createStore } from '@ngneat/elf';
import { 
    addEntities, 
    selectAllEntities, 
    setEntities, 
    updateEntities, 
    deleteEntities, 
    withEntities 
} from '@ngneat/elf-entities';

export interface User {
    id: string;
    name: string;
    active: boolean;
}

export const usersStore = createStore(
    { name: 'users' }, 
    withEntities<User>()
);

export const selectUsers$ = usersStore.pipe(selectAllEntities());

export function replaceUsers(users: User[]) {
  usersStore.update(setEntities(users));
}

export function addUsers(users: User[] | User) {
  usersStore.update(addEntities(users));
}

export function toggleActive(id: string) {
  usersStore.update(updateEntities(id, (u) => ({ ...u, active: !u.active })));
}

export function removeUser(id: string) {
  usersStore.update(deleteEntities(id));
}
