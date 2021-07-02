import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// @todo kmz
import { ValidationMessagesModule } from '@valueadd/validation-messages/dist';
import { RouterModule } from '@angular/router';
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
