import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  ValidationMessagesConfig,
  ValidationMessagesService,
} from '@valueadd/validation-messages/dist';

export const validationMessagesConfig: ValidationMessagesConfig = {
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup;
  errors$: Observable<Array<ApiErrorMessage | string>>;

  constructor(
    private fb: FormBuilder,
    private validationMessagesService: ValidationMessagesService
  ) {}

  ngOnInit(): void {
    console.log(this.validationMessagesService);
    this.validationMessagesService.setValidationMessages(
      validationMessagesConfig
    );

    this.form = this.fb.group({
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

    this.errors$ = this.getApiErr();
  }

  getApiErr(): Observable<ApiErrorMessage[]> {
    const emptyObs = of([]);

    const obsMock = of([
      {
        message: 'APIRequired!',
        property: 'APIrequired',
      },
    ]);

    const maxLength2 = this.form.get('person.age').valueChanges.pipe(
      map((x) => {
        console.log(x);
        if (!x || x.length <= 5) {
          return null;
        } else {
          return [
            {
              message: 'MaxLength 5 APIRequired!',
              property: 'APIrequired',
            },
          ];
        }
      })
    );
    return maxLength2;
  }
}

export interface ApiErrorMessage {
  message: string;
  property: string;
}
