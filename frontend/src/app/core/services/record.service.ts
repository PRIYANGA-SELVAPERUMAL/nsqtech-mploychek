import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { VerificationRecord } from '../../shared/models/record.model';

@Injectable({ providedIn: 'root' })
export class RecordService {
  private readonly API = 'http://localhost:3000/api/records';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private recordsSubject = new BehaviorSubject<VerificationRecord[]>([]);
  records$ = this.recordsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRecords(delay: number = 0): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.get<any>(`${this.API}?delay=${delay}`).pipe(
      tap({
        next: (res) => {
          if (res.success) this.recordsSubject.next(res.records);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.API}/stats`);
  }
}
