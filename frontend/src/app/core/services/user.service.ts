import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = 'http://localhost:3000/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.API).pipe(
      tap(res => { if (res.success) this.usersSubject.next(res.users); })
    );
  }

  getById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${userId}`);
  }

  create(user: Partial<User> & { password: string }): Observable<any> {
    return this.http.post<any>(this.API, user).pipe(
      tap(res => {
        if (res.success) {
          this.usersSubject.next([...this.usersSubject.value, res.user]);
        }
      })
    );
  }

  update(userId: string, updates: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.API}/${userId}`, updates).pipe(
      tap(res => {
        if (res.success) {
          const updated = this.usersSubject.value.map(u => u.userId === userId ? res.user : u);
          this.usersSubject.next(updated);
        }
      })
    );
  }

  delete(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${userId}`).pipe(
      tap(res => {
        if (res.success) {
          this.usersSubject.next(this.usersSubject.value.filter(u => u.userId !== userId));
        }
      })
    );
  }
}
