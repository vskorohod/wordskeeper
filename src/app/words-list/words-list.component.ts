import {Component, OnDestroy, OnInit} from '@angular/core';
import { WordService } from '../word.service';
import { Word } from '../word.model';

@Component({
  selector: 'app-words-list',
  templateUrl: './words-list.component.html',
  styleUrls: ['./words-list.component.scss']
})

export class WordsListComponent implements OnInit, OnDestroy {
  isFetchingWords = false;
  words: Word[] = [];
  isError = false;
  errorMessage = '';
  deleteMessage = '';
  deleteTimeout: number;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.isFetchingWords = true;
    this.wordService.fetchWords().subscribe(words => {
      this.isFetchingWords = false;
      this.words = words;
    }, error => {
      this.isError = true;
      this.errorMessage = error.statusText + '. Try again later.';
      this.isFetchingWords = false;
    });
  }
  onDeleteWord(id: string) {
    this.deleteMessage = 'Delete after 2 seconds';
    this.deleteTimeout = setTimeout(() => {
      this.wordService.deleteWord(id).subscribe(() => {
        this.words = this.words.filter((word) => word.id !== id);
        this.deleteMessage = '';
      }, (error) => {
        this.deleteMessage = '';
        this.isError = true;
        this.errorMessage = error.statusText + '. Try again later.';
      });
    }, 2000);
  }
  changeErrorStatus(errorStatus: boolean) {
    this.isError = errorStatus;
  }
  stopDelete() {
    clearTimeout(this.deleteTimeout);
    this.deleteMessage = '';
  }
  ngOnDestroy() {
    clearTimeout(this.deleteTimeout);
  }
}
