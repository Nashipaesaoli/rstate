import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMsg = signal('');
  loading = signal(false);

  async onSubmit() {
    this.loading.set(true);
    this.errorMsg.set('');

    const { error } = await this.auth.signIn(this.email, this.password);
    this.loading.set(false);

    if (error) {
      this.errorMsg.set(error.message);
      return;
    }
    this.router.navigateByUrl('/');
  }
}