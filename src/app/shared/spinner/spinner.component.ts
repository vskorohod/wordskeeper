import {Component} from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-grow text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  `
})

export class SpinnerComponent {}
