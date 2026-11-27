import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { House, Property } from '../../services/property';

// a single picture in the gallery
interface Slide {
  url: string;
  caption: string;
}

@Component({
  selector: 'app-property-details',
  imports: [DecimalPipe, RouterLink, Navbar, Footer],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css',
})
export class PropertyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(Property);

  house = signal<House | null>(null);
  slides = signal<Slide[]>([]);
  current = signal(0);
  loading = signal(true);

  // the picture that is showing right now
  currentSlide = computed(() => this.slides()[this.current()]);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    try {
      const house = await this.propertyService.getById(id);
      this.house.set(house);

      if (house) {
        // the first picture is the outside one that is already on the card
        const list: Slide[] = [{ url: house.image, caption: 'Outside view' }];

        const images = await this.propertyService.getImages(id);
        for (const img of images) {
          list.push({ url: img.image_url, caption: img.caption ?? 'Inside the house' });
        }
        this.slides.set(list);
      }
    } catch (err) {
      console.error('could not load property', err);
    }

    this.loading.set(false);
  }

  next() {
    this.current.update((i) => (i + 1) % this.slides().length);
  }

  prev() {
    this.current.update((i) => (i - 1 + this.slides().length) % this.slides().length);
  }

  select(i: number) {
    this.current.set(i);
  }

  // left and right arrow keys also move the gallery
  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (this.slides().length < 2) return;
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }
}
