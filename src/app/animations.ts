import { 
    trigger, 
    transition, 
    style, 
    query, 
    group, 
    animate 
  } from '@angular/animations';
  
  export const fadeAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: 0
        })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-in', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]);