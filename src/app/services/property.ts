import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';

export interface House {
  id: number;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
}

// one row from the property_images table (inside photos of a house)
export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

@Injectable({ providedIn: 'root' })
export class Property {
  private supabase = inject(Supabase).client;

  async getAll(): Promise<House[]> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .order('id');
    if (error) throw error;
    return data as House[];
  }

  // get one house using its id
  async getById(id: number): Promise<House | null> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as House | null;
  }

  // get the inside photos of a house in the order I set them
  async getImages(propertyId: number): Promise<PropertyImage[]> {
    const { data, error } = await this.supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('sort_order');
    if (error) throw error;
    return data as PropertyImage[];
  }

  sendInquiry(email: string) {
    return this.supabase.from('inquiries').insert({ email });
  }
}