import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { PropertyDetails } from './pages/property-details/property-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'sign-up', component: SignUp },
  { path: 'property/:id', component: PropertyDetails },
  { path: '**', redirectTo: '' },
];