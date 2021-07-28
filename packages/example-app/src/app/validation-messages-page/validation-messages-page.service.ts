import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ValidationMessagesConfig,
  ValidationMessagesService,
} from '@valueadd/validation-messages';
import { ApiErrorMessage } from './api-error-message';

 const validationMessagesConfig: ValidationMessagesConfig = {
  required: {
    message: '✓This field is required config local.',
    validatorValue: 'required',
  },
  minlength: {
    message: '✓MinLength is 2 local',
    validatorValue: 'minlength',
  },
  maxlength: {
    message: '✓MaxLength is 4 local',
    validatorValue: 'maxlength',
  },
};

@Injectable()
export class ValidationMessagesPageService {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validationMessagesService: ValidationMessagesService
  ) {}

  prepareForm(): void {
    this.validationMessagesService.setValidationMessages(
      validationMessagesConfig
    );

    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      person: this.fb.group({
        age: [
          '2',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(4),
          ],
        ],
      }),
    });
  }

  mockApiErrors$(): Observable<ApiErrorMessage[]> {
    const control = this.form.get('person.age');
    return control.valueChanges.pipe(
      map((value) => this.mockApiMaxLength5(value))
    );
  }

  private mockApiMaxLength5(value: string): ApiErrorMessage[] {
    if (!value || value.length <= 5) {
      return null;
    } else {
      return [
        {
          message: '[API] MaxLength 5',
          property: '[API] MaxLength 5',
        },
      ];
    }
  }
}
