import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  mode = input<'home' | 'login' | 'signup'>('home');
  auth = inject(Auth);
  private router = inject(Router);

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/');
  }
}