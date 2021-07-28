import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  ApiErrorMessage,
  ValidationMessagesPageService,
} from './validation-messages-page.service';

@Component({
  templateUrl: './validation-messages-page.component.html',
  providers: [ValidationMessagesPageService],
})
export class ValidationMessagesPageComponent implements OnInit {
  form: FormGroup;
  errors$: Observable<Array<ApiErrorMessage | string>>;

  constructor(private validationMessagesPageService: ValidationMessagesPageService) {}

  ngOnInit(): void {
    this.validationMessagesPageService.prepareForm();
    this.form = this.validationMessagesPageService.form;
    this.errors$ = this.validationMessagesPageService.mockApiErrors$();
  }
}
