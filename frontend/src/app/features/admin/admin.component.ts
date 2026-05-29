import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showModal = false;
  editingUser: User | null = null;
  userForm!: FormGroup;
  submitting = false;

  adminCount = 0;
  generalCount = 0;
  activeCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
    this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.users = users;
      this.adminCount   = users.filter(u => u.role === 'Admin').length;
      this.generalCount = users.filter(u => u.role === 'General User').length;
      this.activeCount  = users.filter(u => u.isActive).length;
    });
  }

  buildForm(user?: User): void {
    this.userForm = this.fb.group({
      userId:     [user?.userId     || '', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      name:       [user?.name       || '',  Validators.required],
      email:      [user?.email      || '', [Validators.required, Validators.email]],
      password:   ['',                      user ? [] : [Validators.required, Validators.minLength(6)]],
      role:       [user?.role       || 'General User', Validators.required],
      department: [user?.department || '']
    });
    if (user) this.userForm.get('userId')?.disable();
  }

  // Individual typed getters — avoids index signature TS4111 error
  get fUserId():     AbstractControl { return this.userForm.get('userId')!; }
  get fName():       AbstractControl { return this.userForm.get('name')!; }
  get fEmail():      AbstractControl { return this.userForm.get('email')!; }
  get fPassword():   AbstractControl { return this.userForm.get('password')!; }
  get fRole():       AbstractControl { return this.userForm.get('role')!; }
  get fDepartment(): AbstractControl { return this.userForm.get('department')!; }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loading = false,
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.editingUser = null;
    this.buildForm();
    this.error = '';
    this.showModal = true;
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.buildForm(user);
    this.error = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.error = '';
  }

  submitForm(): void {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.error = '';
    const val = this.userForm.getRawValue();

    const req$ = this.editingUser
      ? this.userService.update(this.editingUser.userId, val)
      : this.userService.create(val);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = this.editingUser ? 'User updated successfully!' : 'User created successfully!';
        this.closeModal();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Operation failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    this.userService.delete(user.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.successMsg = `User "${user.name}" deleted.`; setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => this.error = err.error?.message || 'Delete failed'
    });
  }

  goDashboard(): void { this.router.navigate(['/dashboard']); }
  logout(): void { this.auth.logout(); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
