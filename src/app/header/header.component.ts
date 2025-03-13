import { Component, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  showSuggestions = false;
  isSearching = false;
  selectedIndex = -1;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      tap(() => {
        this.isSearching = true;
        this.showSuggestions = true;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        return query ? this.userService.searchUsers(query) : of([]);
      }),
      finalize(() => this.isSearching = false)
    ).subscribe({
      next: results => {
        this.searchResults = results;
        this.selectedIndex = -1;
      },
      error: err => {
        console.error('Search error:', err);
        this.searchResults = [];
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.showSuggestions = false;
    this.searchResults = [];
    this.selectedIndex = -1;
    this.isSearching = false;
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
      this.isSearching = false;
    }, 200);
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
        break;
      case 'ArrowUp':
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        if (this.selectedIndex >= 0) {
          this.navigateToUser(this.searchResults[this.selectedIndex].id);
        }
        break;
      case 'Escape':
        this.clearSearch();
        break;
    }
  }

  navigateToUser(id: number): void {
    this.showSuggestions = false;
    this.searchControl.setValue('');
    this.selectedIndex = -1;
    this.router.navigate(['/user', id]);
  }
}