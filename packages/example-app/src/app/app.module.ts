import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessagesModule } from '@valueadd/validation-messages/dist';
// import { ValidationMessagesModule } from '@valueadd/validation-messages/packages/validation-messages/src';
// import { ValidationMessagesModule } from '../../../validation-messages/src';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      ReactiveFormsModule,
      CommonModule,
      ValidationMessagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
