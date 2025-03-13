import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (typeof import.meta.env !== 'undefined' && import.meta.env.MODE === 'development') {
  console.log('Application starting in development mode');
}

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Application successfully bootstrapped'))
  .catch((err) => console.error('Bootstrap error:', err)); 