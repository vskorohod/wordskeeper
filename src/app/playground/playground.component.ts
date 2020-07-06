import {Component, OnDestroy, OnInit} from '@angular/core';
import {Word} from '../word.model';
import {WordService} from '../word.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit, OnDestroy {
  words: Word[] = [];
  wordsLoading = false;
  currentWord: Word = null;
  checkWordForm: FormGroup;
  isPlay = false;
  isRightAnswer: boolean = null;
  isError = false;
  errorMessage: string = null;
  listsSub: Subscription;
  lists = [];
  currentList = '';
  playModeWithForeignWord = null;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.wordsLoading = true;
    this.wordService.fetchWordsLists().subscribe(
      () => {
      },
      (error) => {
        this.isError = true;
        this.errorMessage = 'Lists were not loaded. Try again later';
      }
    );
    this.listsSub = this.wordService.listsSubject.subscribe(lists => {
      this.lists = lists;
    });
    this.wordService.fetchWords().subscribe(words => {
      this.words = words;
      this.wordsLoading = false;
    }, error => {
      this.isError = true;
      this.wordsLoading = false;
      this.errorMessage = error.statusText;
    });
    this.checkWordForm = new FormGroup({
      answer: new FormControl(null, Validators.required)
    });
  }
  private getRandom(length: number): number {
    return Math.floor(Math.random() * length);
  }
  private getNewWord(listId?: string): Word {
    let wordArray = [];
    if (listId) {
      wordArray = this.words.filter(word => {
        if (word.lists) {
          const element =  Object.values(word.lists).filter((item: {id: string, name: string}) => {
            return item.id === listId;
          });
          return element.length;
        }
      });
    } else {
      wordArray = this.words;
    }
    const elementPosition = this.getRandom(wordArray.length);
    return wordArray[elementPosition];
  }
  onPlay(playModeWithForeignWord?: boolean, listId?: string): void {
    if (!this.playModeWithForeignWord && playModeWithForeignWord) {
      this.playModeWithForeignWord = playModeWithForeignWord;
    }
    if (listId) {
      this.currentList = listId;
    }
    this.isPlay = true;
    this.isRightAnswer = null;
    this.checkWordForm.patchValue({answer: ''});
    this.currentWord = this.getNewWord(this.currentList);
  }
  onCheck(word: string): void {
    if (this.playModeWithForeignWord) {
      this.isRightAnswer = this.currentWord.nativeWord.toLowerCase().trim() === word.toLowerCase().trim();
    } else {
      this.isRightAnswer = this.currentWord.foreignWord.toLowerCase().trim() === word.toLowerCase().trim();
    }
  }
  onCancel(): void {
    this.isPlay = false;
    this.isRightAnswer = null;
    this.currentList = '';
    this.playModeWithForeignWord = null;
  }
  onCloseAnswerPopup(): void {
    this.isRightAnswer = false;
  }
  ngOnDestroy() {
    this.listsSub.unsubscribe();
  }
}
