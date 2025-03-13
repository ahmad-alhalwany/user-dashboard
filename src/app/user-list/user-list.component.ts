import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../services/loading.service';
import { HoverDirective } from '../directives/hover.directive';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressBarModule,
    HoverDirective
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  perPage = 6;
  currentPage = 0;
  isLoading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.fetchUsers(1);
  }

  fetchUsers(page: number): void {
    this.isLoading = true;
    this.userService.getUsers(page).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchUsers(event.pageIndex + 1);
  }

  navigateToUser(id: number): void {
    this.router.navigate(['/user', id]);
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }
}