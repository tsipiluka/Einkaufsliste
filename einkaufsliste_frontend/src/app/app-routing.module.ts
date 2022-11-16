import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOverviewComponent } from './components/list-overview/list-overview.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'list-overview',
    component: ListOverviewComponent
  },
  {
    path: 'shoppinglist',
    component: ShoppinglistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
