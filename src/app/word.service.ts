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
  private translateKey = 'Bearer CggVAgAAABoBMxKABJplLB2Se133ModDOCG9nPxyOoXimBFsOqdoBLfRYuBTITy-pgaaEZgm3xjJ8pX45NrXbrv64Mitm5EY4pOo9y14G9vmrgcdX8-jQJNadS5qL8jG7ohoZNhTlUTl6JbD70gUajHtiODZWbmn3oR60B63pHGo5_5pBxyDa6Oi8Kz9gyRkUpDgce3oqBK_aqCvoVfsISbli615X2xw_T7Nbsph4D4Ysp51fL406j5RMq6x1hWuJVu39i2mdPoBlaEF0PzL58R9iwlA-IO9zpzHEUKfCH26ESEfoB1pJaC2xd9gtKg2R4A3NosP9KZX2Ao11FQ6-dB0ZTVUMDpBz9KNuX0kIAV4DO10P31zLUw46hOoH1in32M_aZsDMNCBfCch4y7-m6wjXf4t1QA5cG-vOeUw0Ur6wSJ5lbbqr3hVTMLc6hkeUcRnumcOgMFO5VKwUTZStGdBjbgBky4Vam5Worz7Y5ysegXLdXEx94VWMOOe6yO8WjKI7QiJMVVziaVw05zlvhiR-CVV468b1Fcud95_csxEo-o7cbG6Po2YiGfQYuSKmlppZecpHeZ7w_4WQlq-8TgzSbj4SrsRf0owNv9kfsav1RDcEu79sZCcbVTWEwpRd1Z2PwFVbBFasZfpvuyYwV8V_ZAkpIauJQq0qmSkI0S3hb__nJttuNQmg8MKGiQQuKrx9wUY-Pvz9wUiFgoUYWpldXJrOWM4M2cyY3JnMGc0dHE=';
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
    translateHeaders = translateHeaders.append('Access-Control-Allow-Origin', '*');
    let translateParams = new HttpParams();
    translateParams = translateParams.append('sourceLanguageCode', 'de');
    translateParams = translateParams.append('targetLanguageCode', 'ru');
    translateParams = translateParams.append('texts', `${word}`);
    translateParams = translateParams.append('folder_id', 'b1gnfinjrlg7j9ptnkan');
    console.log(translateHeaders);
    console.log(translateParams);
    this.http.post('/api/translate', null, {
      headers: translateHeaders,
      params: translateParams
    })
      .subscribe((responseData: {translations: {text: string}[]}) => {
        this.isTranslating.next(false);
        this.translatedWord.next(responseData.translations[0].text);
      });
  }
}
