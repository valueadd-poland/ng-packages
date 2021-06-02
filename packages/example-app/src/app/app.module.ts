import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessagesModule } from '@valueadd/validation-messages';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      CommonModule,
      ReactiveFormsModule,
      ValidationMessagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
