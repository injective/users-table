import { Injectable } from '@angular/core';
import { of, delay, tap, timer, map, withLatestFrom } from 'rxjs';
import { replaceUsers, selectUsers$, type User } from './state/users.store';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  fetchUsersFromServer() {
    const users: User[] = [
      { id: '1758472144041', name: 'Oscar', active: true },
      { id: '1759919100001', name: 'Max', active: false },
      { id: '1239919141125', name: 'Lando', active: true },
    ];

    return of(users).pipe(
      delay(300),
      tap(list => replaceUsers(list))
    );
  }

  checkNameUnique(name: string) {
    return timer(400).pipe(
      withLatestFrom(selectUsers$),
      map(([_, users]) => !users.some(u => u.name.toLowerCase() === String(name).trim().toLowerCase()))
    );
  }
}
