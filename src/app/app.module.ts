import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddWordComponent } from './add-word/add-word.component';
import { WordsListComponent } from './words-list/words-list.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { PlaygroundComponent } from './playground/playground.component';
import { AuthComponent } from './auth/auth.component';
import {AppRoutingModule} from './app-routing.module';
import {SpinnerComponent} from './shared/spinner/spinner.component';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import {ErrorHandlerComponent} from './shared/error-handler/error-handler.component';
import {AddToListsComponent} from './add-word/add-to-lists/add-to-lists.component';

@NgModule({
  declarations: [
    AppComponent,
    AddWordComponent,
    WordsListComponent,
    HomeComponent,
    HeaderComponent,
    PlaygroundComponent,
    AuthComponent,
    SpinnerComponent,
    ErrorHandlerComponent,
    AddToListsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
