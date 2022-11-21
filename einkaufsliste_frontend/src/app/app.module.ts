import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ListOverviewComponent } from './components/list-overview/list-overview.component';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ListboxModule } from 'primeng/listbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import {DividerModule} from 'primeng/divider';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegistrationComponent, ListOverviewComponent, ShoppinglistComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    NgbModule,
    FormsModule,

    CardModule,
    ButtonModule,
    CheckboxModule,
    ConfirmPopupModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
    AvatarModule,
    ToggleButtonModule,
    ListboxModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    SidebarModule,
    TableModule,
    DividerModule
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
