import {Component, OnInit, ViewChild} from '@angular/core';
import {Word} from '../word.model';
import {WordService} from '../word.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit {
  rightAnswerArray: Word[] = [];
  words: Word[] = [];
  currentWord: Word = null;
  checkWordForm: FormGroup;
  result = '';
  isPlay = false;
  isRightAnswer = null;
  private newWord: Word;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.wordService.fetchWords().subscribe(words => {
      this.words = words;
    }, error => {
      console.log(error);
    });
    this.checkWordForm = new FormGroup({
      answer: new FormControl(null, Validators.required)
    });
  }
  private getRandom(length: number): number {
    return Math.floor(Math.random() * length);
  }
  private getNewWord(): Word {
    return this.words[this.getRandom(this.wordService.words.length)];
    // if (this.rightAnswerArray.includes(this.newWord)) {
    //   console.log('Include', this.newWord.foreignWord);
    //   if (this.rightAnswerArray.length === this.wordService.words.length) {
    //     console.log('Lengths are equal');
    //     this.rightAnswer = 'There aren\'t more words';
    //     this.isPlay = false;
    //   }
    //   this.getNewWord();
    // } else {
    //   console.log('Word is uniq', this.newWord.foreignWord);
    //   return this.newWord;
    // }
  }
  onPlay(): void {
    this.result = '';
    this.isPlay = true;
    this.isRightAnswer = null;
    this.currentWord = this.getNewWord();
  }
  onCheck(word: string): void {
    if (this.currentWord.nativeWord.toLowerCase().trim() === word.toLowerCase().trim()) {
      this.isRightAnswer = true;
      this.checkWordForm.patchValue({answer: ''});
      this.rightAnswerArray.push(this.currentWord);
    } else {
      this.isRightAnswer = false;
    }
  }
}
