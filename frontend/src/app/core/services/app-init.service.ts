import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    const token = localStorage.getItem('nsq_token');
    if (!token) return;

    try {
      // Verify token is still valid on app load
      await firstValueFrom(this.http.get('http://localhost:3000/api/auth/me'));
      console.log('[AppInit] Session restored successfully');
    } catch {
      // Token expired — clear storage
      localStorage.removeItem('nsq_token');
      localStorage.removeItem('nsq_user');
      console.log('[AppInit] Session expired, cleared');
    }
  }
}
