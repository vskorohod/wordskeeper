import {Component} from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-grow text-primary" role="status">
      <span class="sr-only"><ng-content></ng-content></span>
    </div>
    <p class="text-center text-primary"><ng-content></ng-content></p>
  `
})

export class SpinnerComponent {}
