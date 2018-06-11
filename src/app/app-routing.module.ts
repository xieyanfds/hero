import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {HeroesComponent} from './heroes/heroes.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeroesDetailComponent} from './heroes-detail/heroes-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'heroes' , component: HeroesComponent},
  {path: 'detail/:id' , component: HeroesDetailComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
