import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EinkaufslistenOverviewComponent } from './einkaufslisten-overview/einkaufslisten-overview.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/einkaufslisten-overview', pathMatch: 'full' },
  { path: 'einkaufslisten-overview', component: EinkaufslistenOverviewComponent},
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }