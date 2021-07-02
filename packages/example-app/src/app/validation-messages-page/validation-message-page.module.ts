import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// symlink lib
import { ValidationMessagesModule } from '@valueadd/validation-messages/dist';
// source code
// import { ValidationMessagesModule } from '@vamsg';
// dist
// import { ValidationMessagesModule } from '@vamsg-dist';
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
