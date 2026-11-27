import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private auth = inject(Auth);
  private router = inject(Router);

  fullName = '';
  email = '';
  phone = '';
  password = '';
  errorMsg = signal('');
  successMsg = signal('');
  loading = signal(false);

  async onSubmit() {
    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    const { data, error } = await this.auth.signUp(
      this.email, this.password, this.fullName, this.phone
    );
    this.loading.set(false);

    if (error) {
      this.errorMsg.set(error.message);
      return;
    }

    // if there is a session the user is already logged in,
    // if not it means email confirmation is switched on
    if (data.session) {
      this.router.navigateByUrl('/');
    } else {
      this.successMsg.set('Account created. Please check your email to confirm it.');
    }
  }
}