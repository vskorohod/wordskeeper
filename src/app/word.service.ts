import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import { Word } from './word.model';
import {catchError, exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';
import {User} from './auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  // tslint:disable-next-line:max-line-length
  // private translateKey = 'Bearer CggVAgAAABoBMxKABJplLB2Se133ModDOCG9nPxyOoXimBFsOqdoBLfRYuBTITy-pgaaEZgm3xjJ8pX45NrXbrv64Mitm5EY4pOo9y14G9vmrgcdX8-jQJNadS5qL8jG7ohoZNhTlUTl6JbD70gUajHtiODZWbmn3oR60B63pHGo5_5pBxyDa6Oi8Kz9gyRkUpDgce3oqBK_aqCvoVfsISbli615X2xw_T7Nbsph4D4Ysp51fL406j5RMq6x1hWuJVu39i2mdPoBlaEF0PzL58R9iwlA-IO9zpzHEUKfCH26ESEfoB1pJaC2xd9gtKg2R4A3NosP9KZX2Ao11FQ6-dB0ZTVUMDpBz9KNuX0kIAV4DO10P31zLUw46hOoH1in32M_aZsDMNCBfCch4y7-m6wjXf4t1QA5cG-vOeUw0Ur6wSJ5lbbqr3hVTMLc6hkeUcRnumcOgMFO5VKwUTZStGdBjbgBky4Vam5Worz7Y5ysegXLdXEx94VWMOOe6yO8WjKI7QiJMVVziaVw05zlvhiR-CVV468b1Fcud95_csxEo-o7cbG6Po2YiGfQYuSKmlppZecpHeZ7w_4WQlq-8TgzSbj4SrsRf0owNv9kfsav1RDcEu79sZCcbVTWEwpRd1Z2PwFVbBFasZfpvuyYwV8V_ZAkpIauJQq0qmSkI0S3hb__nJttuNQmg8MKGiQQuKrx9wUY-Pvz9wUiFgoUYWpldXJrOWM4M2cyY3JnMGc0dHE=';
  words: Word[] = [];
  lists: any[] = [];
  listsSubject = new Subject<any[]>();
  isTranslating = new Subject<boolean>();
  translatedWord = new Subject<string>();
  private firebaseURL = 'https://wordskeeper-298da.firebaseio.com/';
  private currentUser = JSON.parse(localStorage.getItem('userData'));
  constructor(private http: HttpClient, private authService: AuthService) {}
  fetchWords(): Observable<Word[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http
          .get<{[key: string]: Word}>(
            `${this.firebaseURL}users/${this.currentUser.id}/words.json`
          ).pipe(
            map(responseData => {
              const wordsArray = [];
              if (responseData) {
                for (const key of Object.keys(responseData)) {
                  wordsArray.push({...responseData[key], id: key});
                }
              }
              return wordsArray;
            })
          );
      }),
      );
  }
  addWords(newWord): Observable<object> {
    return this.http.post(
      `${this.firebaseURL}users/${this.currentUser.id}/words.json`, newWord);
  }
  deleteWord(id: string): Observable<object> {
    return this.http.delete(
      `${this.firebaseURL}users/${this.currentUser.id}/words/${id}.json`);
  }
  fetchWordsLists(): Observable<any[]> {
    return this.http.get(`${this.firebaseURL}users/${this.currentUser.id}/lists.json`)
      .pipe(
        catchError(err => throwError(err)),
        map(this.dataHandler),
        tap(listsArrayRes => {
          if (listsArrayRes) {
            this.lists = listsArrayRes;
            this.listsSubject.next(this.lists);
          }
        })
      );
  }
  addWordsList(listName: string): Observable<object> {
    return this.http.post(
      `${this.firebaseURL}users/${this.currentUser.id}/lists.json`, {name: listName})
      .pipe(
        catchError(err => throwError(err)),
        tap((addListRes: {name: string}) => {
          if (addListRes) {
            this.lists.push({name: listName, id: addListRes.name});
            this.listsSubject.next(this.lists);
          }
        })
      );
  }
  // translateWord(word: string): void {
  //   this.isTranslating.next(true);
  //   let translateHeaders: HttpHeaders = new HttpHeaders();
  //   translateHeaders = translateHeaders.append('Authorization', this.translateKey);
  //   translateHeaders = translateHeaders.append('Access-Control-Allow-Origin', '*');
  //   let translateParams = new HttpParams();
  //   translateParams = translateParams.append('sourceLanguageCode', 'de');
  //   translateParams = translateParams.append('targetLanguageCode', 'ru');
  //   translateParams = translateParams.append('texts', `${word}`);
  //   translateParams = translateParams.append('folder_id', 'b1gnfinjrlg7j9ptnkan');
  //   this.http.post('https://translate.api.cloud.yandex.net/translate/v2/translate', null, {
  //     headers: translateHeaders,
  //     params: translateParams
  //   })
  //     .subscribe((responseData: {translations: {text: string}[]}) => {
  //       this.isTranslating.next(false);
  //       this.translatedWord.next(responseData.translations[0].text);
  //     });
  // }
  private dataHandler(responseData): any[] {
    const array = [];
    if (responseData) {
      for (const key of Object.keys(responseData)) {
        array.push({...responseData[key], id: key});
      }
      return array;
    } else {
      return;
    }
  }
}
