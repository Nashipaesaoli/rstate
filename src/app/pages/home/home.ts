import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { House, Property } from '../../services/property';

@Component({
  selector: 'app-home',
  imports: [DecimalPipe, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private propertyService = inject(Property);

  houses = signal<House[]>([]);
  email = '';
  message = signal('');
  isError = signal(false);

  async ngOnInit() {
    try {
      this.houses.set(await this.propertyService.getAll());
    } catch (err) {
      console.error('could not load properties', err);
    }
  }

  async sendEmail() {
    const { error } = await this.propertyService.sendInquiry(this.email);
    if (error) {
      this.isError.set(true);
      this.message.set('Something went wrong, please try again.');
    } else {
      this.isError.set(false);
      this.message.set('Thanks! We will get back to you soon.');
      this.email = '';
    }
  }
}