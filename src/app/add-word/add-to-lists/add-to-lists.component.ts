import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {WordService} from '../../word.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-to-lists',
  templateUrl: './add-to-lists.component.html'
})

export class AddToListsComponent implements OnInit, OnDestroy {
  lists = [];
  selectedLists = [];
  listsSub: Subscription;
  @Output() selectedListsEvent = new EventEmitter();
  isError = false;
  errorMessage = '';
  isLoading = false;
  isAdding = false;
  constructor(private wordService: WordService) {}
  ngOnInit() {
    this.lists = this.wordService.lists;
    this.isLoading = true;
    this.listsSub = this.wordService.listsSubject.subscribe(lists => {
      this.lists = lists;
    });
    this.wordService.fetchWordsLists().subscribe(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = 'Lists were not loaded. Try again later';
      }
    );
  }
  addList(id: string) {
    const currentElement = this.lists.find(list => list.id === id);
    this.selectedLists.push(currentElement);
    this.lists = this.lists.filter(list => list.id !== id);
    this.selectedListsEvent.next(this.selectedLists);
  }

  removeList(id: string) {
    const currentElement = this.selectedLists.find(list => list.id === id);
    this.lists.push(currentElement);
    this.selectedLists = this.selectedLists.filter(list => list.id !== id);
    this.selectedListsEvent.next(this.selectedLists);
  }

  addNewList(newListName: string) {
    if (newListName.trim()) {
      this.isAdding = true;
      this.wordService.addWordsList(newListName).subscribe(
        (res) => {
          this.isAdding = false;
        },
        (error) => {
          this.isError = true;
          this.isAdding = false;
          this.errorMessage = 'The list was not added. An error occurred. Try again later';
        }
      );
    }
  }
  errorStatusChange(errorStatus: boolean) {
    this.isError = errorStatus;
  }
  ngOnDestroy() {
    this.listsSub.unsubscribe();
  }
}
