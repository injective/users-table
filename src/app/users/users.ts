import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { selectUsers$, toggleActive, removeUser } from './state/users.store';
import { UsersService } from './users.service';
import { AddUser } from './add-user/add-user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe, 
    AddUser
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {

  readonly users$ = selectUsers$;
  readonly canAddUser$ = this.users$.pipe(
    map(users => users.length < 5 && users.every(u => u.active))
  );
  isAdding = false;
  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.fetchUsersFromServer().subscribe();
  }

  onToggleActive(id: string) {
    toggleActive(id);
  }

  openAddUser() {
    this.isAdding = true;
  }

  closeAddUser() {
    this.isAdding = false;
  }

  onRemoveUser(id: string) {
    removeUser(id);
  }
}
