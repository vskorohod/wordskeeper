import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Word } from './word.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  words: Word[] = [];
  wordsSub = new Subject<Word[]>();
  isSending = new Subject<boolean>();
  isFetchingWords = new Subject<boolean>();
  error = new Subject<Error>();
  constructor(private http: HttpClient) {}
  fetchWords(): void {
    this.isFetchingWords.next(true);
    this.http
      .get<{[key: string]: Word}>('https://wordskeeper-298da.firebaseio.com/words.json')
      .pipe(map(responseData => {
        const wordsArray = [];
        for (const key of Object.keys(responseData)) {
          wordsArray.push({...responseData[key], id: key});
        }
        return wordsArray;
      }))
      .subscribe((words: Word[]) => {
        this.isFetchingWords.next(false);
        this.words = words;
        this.wordsSub.next(this.words);
      }, (error) => this.error.next(error));
  }
  addWords(newWord): void {
    this.isSending.next(true);
    this.http.post('https://wordskeeper-298da.firebaseio.com/words.json', newWord)
      .subscribe((responseData: {name: string}) => {
        if (responseData) {
          this.isSending.next(false);
          this.words.push({...newWord, id: responseData.name});
          this.wordsSub.next(this.words);
        }
      }, (error) => this.error.next(error));
  }
  deleteWord(id: string): void {
    this.http.delete('https://wordskeeper-298da.firebaseio.com/words/' + id + '.json');
    this.words = this.words.filter((word) => word.id !== id);
    this.wordsSub.next(this.words);
  }
}
