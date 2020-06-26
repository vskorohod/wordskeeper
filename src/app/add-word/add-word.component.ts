import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})

export class AddWordComponent implements OnInit {
  addWordForm: FormGroup;
  isSuccessSend = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.addWordForm = new FormGroup({
      foreignWord: new FormControl(null, Validators.required),
      nativeWord: new FormControl(null, Validators.required),
      comment: new FormControl(null)
    });
  }
  onAddWord(postData: {foreignWord: string, nativeWord: string, comment: string}) {
    this.http.post('https://wordskeeper-298da.firebaseio.com/words.json', postData)
      .subscribe(responseData => {
        if (responseData) {
          this.isSuccessSend = true;
          this.addWordForm.reset();
        }
      });
  }
}
