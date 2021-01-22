import * as jwt from 'jsonwebtoken';

export interface UserJwt {
  [name: string]:
    | undefined
    | {
        user?: number;
      };
}

declare module 'jsonwebtoken' {
  export function verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): UserJwt;
}
