import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddWordComponent} from './add-word/add-word.component';
import {WordsListComponent} from './words-list/words-list.component';
import {PlaygroundComponent} from './playground/playground.component';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './auth/auth.guard';

const appRoutes: Routes = [
  {path: '', pathMatch: 'prefix', redirectTo: 'add-word'},
  {path: 'add-word', component: AddWordComponent, canActivate: [AuthGuard]},
  {path: 'words-list', component: WordsListComponent, canActivate: [AuthGuard]},
  {path: 'play', component: PlaygroundComponent, canActivate: [AuthGuard]},
  {path: 'auth', component: AuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
