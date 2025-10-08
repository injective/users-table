import { Component } from '@angular/core';
import { UsersComponent } from "./users/users";

@Component({
  selector: 'app-root',
  imports: [UsersComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
