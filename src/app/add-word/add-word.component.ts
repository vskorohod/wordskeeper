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

export class AddWordComponent implements OnInit, OnDestroy {
  addWordForm: FormGroup;
  isSending = false;
  isSendingSub: Subscription;
  isTranslating = false;
  isTranslatingSub: Subscription;
  translatedWordSub: Subscription;
  wordsSub: Subscription;
  constructor(private wordService: WordService) {}

  ngOnInit() {
    this.translatedWordSub = this.wordService.translatedWord.subscribe(translatedWord => {
      this.addWordForm.patchValue({nativeWord: translatedWord});
    });
    this.isSendingSub = this.wordService.isSending.subscribe(isSending => this.isSending = isSending);
    this.isTranslatingSub = this.wordService.isTranslating.subscribe(isTranslating => this.isTranslating = isTranslating);
    this.wordsSub = this.wordService.wordsSub.subscribe(() => {
      this.addWordForm.reset();
    });
    this.addWordForm = new FormGroup({
      foreignWord: new FormControl(null, Validators.required),
      nativeWord: new FormControl(null, Validators.required),
      comment: new FormControl(null)
    });
  }
  onAddWord({foreignWord, nativeWord, comment}: {foreignWord: string, nativeWord: string, comment: string}) {
    const newWord: Word = {foreignWord, nativeWord, comment, createDate: new Date()};
    this.wordService.addWords(newWord);
  }
  // onTranslateWord(foreignWord: string) {
  //   this.wordService.translateWord(foreignWord);
  // }
  ngOnDestroy() {
    this.translatedWordSub.unsubscribe();
    this.isTranslatingSub.unsubscribe();
    this.isSendingSub.unsubscribe();
  }
}
