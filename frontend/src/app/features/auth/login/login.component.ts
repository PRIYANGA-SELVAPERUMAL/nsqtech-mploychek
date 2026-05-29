import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  roles = ['General User', 'Admin'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      userId:   ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role:     ['General User', Validators.required]
    });
  }

  // Individual getters — no index signature, no TS4111
  get userId(): AbstractControl { return this.loginForm.get('userId')!; }
  get password(): AbstractControl { return this.loginForm.get('password')!; }
  get role(): AbstractControl { return this.loginForm.get('role')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { userId, password, role } = this.loginForm.value;

    this.auth.login(userId, password, role).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
