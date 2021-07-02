import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  ApiErrorMessage,
  ValidationMessagesPresenter,
} from './validation-messages-page.presenter';

@Component({
  templateUrl: './validation-messages-page.component.html',
  providers: [ValidationMessagesPresenter],
})
export class ValidationMessagesPageComponent implements OnInit {
  form: FormGroup;
  errors$: Observable<Array<ApiErrorMessage | string>>;

  constructor(private presenter: ValidationMessagesPresenter) {}

  ngOnInit(): void {
    this.presenter.prepareForm();
    this.form = this.presenter.form;
    this.errors$ = this.presenter.mockApiErrors$();
  }
}
