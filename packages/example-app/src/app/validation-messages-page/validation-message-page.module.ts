import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ValidationMessagesModule } from '@valueadd/validation-messages';
import { ValidationMessagesPageComponent } from './validation-messages-page.component';

@NgModule({
  declarations: [ValidationMessagesPageComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ValidationMessagesModule,
    RouterModule.forChild([
      { path: '', component: ValidationMessagesPageComponent },
    ]),
  ],
})
export class ValidationMessagePageModule {}
