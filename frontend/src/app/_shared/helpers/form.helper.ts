import { FormControl } from '@angular/forms';
import { UserFormModel } from '../models/auth.model';

export type FormControls<T> = {
  [K in keyof T]: FormControl<T[K] | null>;
};
export type UserFormControls = FormControls<UserFormModel>;
