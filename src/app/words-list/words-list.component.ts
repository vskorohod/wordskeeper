import {Component, OnDestroy, OnInit} from '@angular/core';
import { WordService } from '../word.service';
import { Word } from '../word.model';
import {log} from 'util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-words-list',
  templateUrl: './words-list.component.html',
  styleUrls: ['./words-list.component.scss']
})

export class WordsListComponent implements OnInit, OnDestroy {
  isFetchingWords = false;
  fetchingWordsSub: Subscription;
  words: Word[] = [];
  wordsSub: Subscription;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.fetchingWordsSub = this.wordService.isFetchingWords.subscribe((isFetchingWords) => {
      this.isFetchingWords = isFetchingWords;
    });
    this.wordService.fetchWords();
    this.wordsSub = this.wordService.wordsSub.subscribe((words) => {
      this.words = words;
    });
  }
  onDeleteWord(id: string) {
    this.wordService.deleteWord(id);
  }
  ngOnDestroy() {
    this.fetchingWordsSub.unsubscribe();
    this.wordsSub.unsubscribe();
  }
}
