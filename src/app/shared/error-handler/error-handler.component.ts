import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-error-handler',
  template: `
    <div class="fixed-top alert alert-danger" role="alert" *ngIf="isError">
      {{ errorMessage }}
      <button type="button" class="close" aria-label="Close" (click)="onCloseError()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
})

export class ErrorHandlerComponent {
  @Input() errorMessage;
  @Input() isError = false;
  @Output() errorStatusChange = new EventEmitter<boolean>();
  onCloseError() {
    this.isError = false;
    this.errorStatusChange.emit(this.isError);
  }
}
