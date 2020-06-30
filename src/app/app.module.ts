import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AddWordComponent } from './add-word/add-word.component';
import { WordsListComponent } from './words-list/words-list.component';
import { HomeComponent } from './home/home.component';
import {HeaderComponent} from './header/header.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'add-word', component: AddWordComponent},
  {path: 'words-list', component: WordsListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AddWordComponent,
    WordsListComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
