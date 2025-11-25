import { UserFormModel } from '@app/_shared/models/auth.model';

export namespace AuthActions {
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: UserFormModel) {}
  }
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
