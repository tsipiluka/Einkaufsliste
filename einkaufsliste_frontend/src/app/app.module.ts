import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ListOverviewComponent } from './components/list-overview/list-overview.component';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from 'src/environments/environment.prod';


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
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {BadgeModule} from 'primeng/badge';
import { FriendlistBarComponent } from './components/list-overview/friendlist-bar/friendlist-bar/friendlist-bar.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegistrationComponent, ListOverviewComponent, ShoppinglistComponent, FriendlistBarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    NgbModule,
    FormsModule,
    GoogleMapsModule,
    HttpClientJsonpModule,

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
    DividerModule,
    AutoCompleteModule,
    GMapModule,
    ProgressSpinnerModule,
    BadgeModule,
  ],
  providers: [ConfirmationService, MessageService,
  {
    provide: 'BACKEND_URL',useValue: environment.BACKEND_URL,
  }, 
  {
    provide: 'FRONTEND_URL',useValue: environment.FRONTEND_URL,
  },
  {
    provide: 'GOOGLE_API_KEY_CLIENT_ID',useValue: environment.GOOGLE_API_KEY_CLIENT_ID,
  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
