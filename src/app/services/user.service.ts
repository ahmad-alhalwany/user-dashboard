import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, shareReplay, switchMap, catchError } from 'rxjs/operators';
import { User, UserListResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private pageCache = new Map<number, { users: User[], total: number }>();

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<{ users: User[], total: number }> {
    if (this.pageCache.has(page)) {
      return of(this.pageCache.get(page)!);
    }

    return this.http.get<UserListResponse>(`${this.apiUrl}?page=${page}`).pipe(
      map(response => {
        const cacheValue = {
          users: response.data,
          total: response.total
        };
        this.pageCache.set(page, cacheValue);
        return cacheValue;
      }),
      shareReplay(1)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      shareReplay(1)
    );
  }

  searchUsers(query: string): Observable<User[]> {
    if (!query) {
      return of([]);
    }

    return this.getTotalPages().pipe(
      switchMap(totalPages => {
        const pageRequests = [];
        for (let page = 1; page <= totalPages; page++) {
          pageRequests.push(this.getUsers(page));
        }
        return forkJoin(pageRequests);
      }),
      map(responses => {
        const allUsers = responses.flatMap(response => response.users);
        return allUsers.filter(user =>
          user.first_name.toLowerCase().includes(query.toLowerCase()) ||
          user.last_name.toLowerCase().includes(query.toLowerCase()) ||
          user.id.toString().includes(query)
        );
      }),
      catchError(error => {
        console.error('Search failed:', error);
        return of([]);
      })
    );
  }

  private getTotalPages(): Observable<number> {
    return this.http.get<UserListResponse>(`${this.apiUrl}?page=1`).pipe(
      map(response => response.total_pages),
      catchError(() => of(1))
    );
  }
}