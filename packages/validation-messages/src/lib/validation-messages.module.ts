import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ValidationMessagesComponent } from "./components/validation-messages/validation-messages.component";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent],
})
export class ValidationMessagesModule {}
