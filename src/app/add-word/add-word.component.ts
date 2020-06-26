import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})

export class AddWordComponent implements OnInit {
  addWordForm: FormGroup;

  ngOnInit() {
    this.addWordForm = new FormGroup({
      foreignWord: new FormControl(null, Validators.required),
      nativeWord: new FormControl(null, Validators.required),
      comment: new FormControl(null)
    });
  }
}
