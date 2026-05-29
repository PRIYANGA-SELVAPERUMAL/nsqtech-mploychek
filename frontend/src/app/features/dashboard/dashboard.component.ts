import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RecordService } from '../../core/services/record.service';
import { User } from '../../shared/models/user.model';
import { VerificationRecord } from '../../shared/models/record.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  firstName = '';
  records: VerificationRecord[] = [];
  stats: any = null;
  loading = false;
  statsLoading = false;
  error = '';
  delay = 0;

  private destroy$ = new Subject<void>();

  constructor(
    public auth: AuthService,
    private recordService: RecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.firstName = this.currentUser?.name?.split(' ')[0] ?? '';
    this.loadStats();
    this.loadRecords(2000);
  }

  loadRecords(delayMs: number = 0): void {
    this.loading = true;
    this.error = '';
    this.delay = delayMs;
    this.recordService.getRecords(delayMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.records = res.records; this.loading = false; },
        error: (err) => { this.error = err.error?.message || 'Failed to load records'; this.loading = false; }
      });
  }

  loadStats(): void {
    this.statsLoading = true;
    this.recordService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => { this.stats = res.stats; this.statsLoading = false; },
        error: () => this.statsLoading = false
      });
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'Verified': 'status-verified', 'In Progress': 'status-progress',
      'Pending': 'status-pending', 'Flagged': 'status-flagged', 'Rejected': 'status-rejected'
    };
    return map[status] || '';
  }

  getPriorityClass(priority: string): string { return `priority-${priority.toLowerCase()}`; }
  goToAdmin(): void { this.router.navigate(['/admin']); }
  logout(): void { this.auth.logout(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
