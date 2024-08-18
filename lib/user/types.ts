import { AuthenticatorDevice } from "@simplewebauthn/typescript-types";

export type UserDevice = Omit<
  AuthenticatorDevice,
  "credentialPublicKey" | "credentialID"
> & {
  credentialID: string;
  credentialPublicKey: string;
};

export type User = {
  email: string;
  devices: UserDevice[];
};
