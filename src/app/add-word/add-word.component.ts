import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Word} from '../word.model';
import {WordService} from '../word.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})

export class AddWordComponent implements OnInit {
  addWordForm: FormGroup;
  isSending = false;
  isTranslating = false;
  isError = false;
  errorMessage = '';
  selectedLists = [];
  constructor(private wordService: WordService) {}

  ngOnInit() {
    // this.translatedWordSub = this.wordService.translatedWord.subscribe(translatedWord => {
    //   this.addWordForm.patchValue({nativeWord: translatedWord});
    // });
    // this.isTranslatingSub = this.wordService.isTranslating.subscribe(isTranslating => this.isTranslating = isTranslating);
    this.addWordForm = new FormGroup({
      foreignWord: new FormControl(null, Validators.required),
      nativeWord: new FormControl(null, Validators.required),
      comment: new FormControl(null)
    });
  }
  onAddWord({foreignWord, nativeWord, comment}: {foreignWord: string, nativeWord: string, comment: string}): void {
    this.isSending = true;
    const newWord: Word = {
      foreignWord,
      nativeWord,
      comment,
      createDate: new Date(),
      rightAnswerQuantity: 0,
      lists: this.selectedLists

    };
    this.wordService.addWords(newWord).subscribe(res => {
      this.isSending = false;
      this.addWordForm.reset();
    }, error => {
      this.isError = true;
      this.errorMessage = error.error.error + '. Try again later';
      this.isSending = false;
    });
  }
  // onTranslateWord(foreignWord: string) {
  //   this.wordService.translateWord(foreignWord);
  // }
  changeErrorStatus(errorStatus: boolean): void {
    this.isError = errorStatus;
  }
  onSelectedLists(listsArray) {
    this.selectedLists = listsArray;
  }
}
