import {Component, OnInit} from '@angular/core';
import {Word} from '../word.model';
import {WordService} from '../word.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit {
  words: Word[] = [];
  wordsLoading = false;
  currentWord: Word = null;
  checkWordForm: FormGroup;
  isPlay = false;
  isRightAnswer: boolean = null;
  isError = false;
  errorMessage: string = null;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.wordsLoading = true;
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
  private getNewWord(): Word {
    const elementPosition = this.getRandom(this.words.length);
    return this.words[elementPosition];
  }
  onPlay(): void {
    this.isPlay = true;
    this.isRightAnswer = null;
    this.checkWordForm.patchValue({answer: ''});
    this.currentWord = this.getNewWord();
  }
  onCheck(word: string): void {
    this.isRightAnswer = this.currentWord.nativeWord.toLowerCase().trim() === word.toLowerCase().trim();
  }
}
