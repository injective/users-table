import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { addUsers, type User } from '../state/users.store';

@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss'
})
export class AddUser {
  @Output() closed = new EventEmitter<void>();

  usersForm: FormGroup<{ 
    name: FormControl<string | null>; 
    active: FormControl<boolean>; 
  }>;

  constructor(
    private fb: FormBuilder, 
    private usersService: UsersService
  ) {
    this.usersForm = this.fb.nonNullable.group({
      name: this.fb.control<string | null>(null, {
        validators: [
          Validators.required, 
          Validators.minLength(2)
        ],
        asyncValidators: [(control) => this.uniqueNameValidator(control)],
        updateOn: 'change'
      }),
      active: this.fb.control<boolean>(false)
    });
  }

  private uniqueNameValidator(control: AbstractControl<string | null>) {
    const value = control.value ?? '';
    if (!value.trim()) {
      return of(null);
    }
    return of(value).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(name => {
        return this.usersService.checkNameUnique(name).pipe(
          map(isUnique => (isUnique ? null : { nameTaken: true }))
        );
      })
    );
  }

  createUser() {
    if (this.usersForm.invalid || this.usersForm.pending) {
      return;
    }
    const { name, active } = this.usersForm.getRawValue();
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      active
    };
    addUsers(newUser);
    this.closed.emit();
  }
}
