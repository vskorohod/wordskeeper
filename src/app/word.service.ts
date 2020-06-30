import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject, throwError} from 'rxjs';
import { Word } from './word.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  // tslint:disable-next-line:max-line-length
  private translateKey = 'Bearer CggVAgAAABoBMxKABL86HP1aqvRr1ufzOvoOPtj-9Sq73X_4llh-ZwlWrXz8BZ7l1hTEHa1A3wOErzRqXcGutxS11b27owKLSUkWhtH4izZtFZ6CSO-mx9mhJufNQhIpUD3CmpnLvK3PBwx8ylx6AynUXOeFtZ6nBPLVhsWKUeruHvD8dlrXkqlxSjrEPXybszjb_IoxceDcLfWLJJgB7ySx2VW9popEjTNPf9fx5xBmJbIQfTw81SfduiT87lpJxJP092wTgrEpAcBnQHYl1S2eFjoOD1qb9OZhWhdQ8AP9ez9QAO5exKX6uTXG-ExH8LZvIESi-qxYT5Gc2t5Vw_rDiePkY4VtqXBF3CONtibWcQTiaWO-txxRPdO4ZbarBsXltgrKsTLC1d6ADnJNY9d3xtlJB26XlbTZ3Uh0hgdSENy1jK62OaOUW2FqPTQpWzFOrrXrCcltK729yXVh8BXu5N80UsNQO4hMSNR2JePG_MK0XeRDJ5E2JXGq7O9Fj0OKka4eJ8GFVTJ1pX9wbTAmtFZNckgizcVljsiVf-lYT9u8losrAcR0NvIBijtyvUoWMj5e9Iiru_djdsSFgctdcEhAKzhkL2nHxlV5ZC_KQGyZczwbTLD1hTatoB03bXbu0EwtUJzAd45hV9NXsJV-wYkaUI9kYoMxYgvLhAT5GNZuigD8LIf3hspfGiQQiOHr9wUYyLLu9wUiFgoUYWpldXJrOWM4M2cyY3JnMGc0dHE=';
  words: Word[] = [];
  wordsSub = new Subject<Word[]>();
  isSending = new Subject<boolean>();
  isTranslating = new Subject<boolean>();
  isFetchingWords = new Subject<boolean>();
  error = new Subject<Error>();
  translatedWord = new Subject<string>();
  constructor(private http: HttpClient) {}
  fetchWords(): void {
    this.isFetchingWords.next(true);
    this.http
      .get<{[key: string]: Word}>('https://wordskeeper-298da.firebaseio.com/words.json')
      .pipe(map(responseData => {
        const wordsArray = [];
        if (responseData) {
          for (const key of Object.keys(responseData)) {
            wordsArray.push({...responseData[key], id: key});
          }
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
    this.http.delete('https://wordskeeper-298da.firebaseio.com/words/' + id + '.json')
      .subscribe();
    this.words = this.words.filter((word) => word.id !== id);
    this.wordsSub.next(this.words);
  }
  translateWord(word: string): void {
    this.isTranslating.next(true);
    let translateHeaders: HttpHeaders = new HttpHeaders();
    translateHeaders = translateHeaders.append('Authorization', this.translateKey);
    let translateParams = new HttpParams();
    translateParams = translateParams.append('sourceLanguageCode', 'de');
    translateParams = translateParams.append('targetLanguageCode', 'ru');
    translateParams = translateParams.append('texts', `${word}`);
    translateParams = translateParams.append('folder_id', 'b1gnfinjrlg7j9ptnkan');
    this.http.post('https://translate.api.cloud.yandex.net/translate/v2/translate', null, {
      headers: translateHeaders,
      params: translateParams
    })
      .subscribe((responseData: {translations: {text: string}[]}) => {
        this.isTranslating.next(false);
        this.translatedWord.next(responseData.translations[0].text);
      });
  }
}
