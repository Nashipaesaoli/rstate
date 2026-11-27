import { Injectable, inject, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Supabase } from './supabase';

@Injectable({ providedIn: 'root' })
export class Auth {
  private supabase = inject(Supabase).client;

  // holds the logged in user, null if nobody is logged in
  user = signal<User | null>(null);

  constructor() {
    this.supabase.auth.getSession().then(({ data }) => {
      this.user.set(data.session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  signUp(email: string, password: string, fullName: string, phone: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}