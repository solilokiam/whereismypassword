"use server";

import {
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { origin, rpId } from "../constants";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { create, find } from "../user/userStorage";
import { getOrCreateSession, saveSession } from "../session/session";
import { UserDevice } from "../user/types";
import { isoUint8Array } from "@simplewebauthn/server/helpers";

export const generateWebAuthnRegistrationOptions = async (email: string) => {
  const user = await find(email);

  if (user) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: "WhereIsMyPasswordWebAutn",
    rpID: rpId,
    userID: isoUint8Array.fromUTF8String(email),
    userName: email,
    timeout: 60000,
    attestationType: "none",
    excludeCredentials: [],
    authenticatorSelection: {
      residentKey: "discouraged",
    },
    /**
     * Support the two most common algorithms: ES256, and RS256
     */
    supportedAlgorithmIDs: [-7, -257],
  };

  const options = await generateRegistrationOptions(opts);

  await saveSession({ currentChallenge: options.challenge, email });

  return {
    success: true,
    data: options,
  };
};

export const verifyWebAuthnRegistration = async (
  data: RegistrationResponseJSON
) => {
  const {
    data: { email, currentChallenge },
  } = await getOrCreateSession();

  if (!email || !currentChallenge) {
    return {
      success: false,
      message: "Session expired verify",
    };
  }

  const expectedChallenge = currentChallenge;

  const opts: VerifyRegistrationResponseOpts = {
    response: data,
    expectedChallenge: `${expectedChallenge}`,
    expectedOrigin: origin,
    expectedRPID: rpId,
    requireUserVerification: false,
  };
  const verification = await verifyRegistrationResponse(opts);

  const { verified, registrationInfo } = verification;

  if (!verified || !registrationInfo) {
    return {
      success: false,
      message: "Registration failed",
    };
  }

  const { credentialPublicKey, credentialID, counter } = registrationInfo;

  /**
   * Add the returned device to the user's list of devices
   */
  const newDevice: UserDevice = {
    credentialPublicKey: isoBase64URL.fromBuffer(credentialPublicKey),
    credentialID: credentialID,
    counter,
    transports: data.response.transports,
  };

  await saveSession({});

  try {
    await create(email, [newDevice]);
  } catch {
    return {
      success: false,
      message: "User already exists",
    };
  }

  return {
    success: true,
  };
};

export const generateWebAuthnLoginOptions = async (email: string) => {
  const user = await find(email);

  if (!user) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: user.devices.map((dev) => ({
      id: dev.credentialID,
      type: "public-key",
      transports: dev.transports,
    })),
    userVerification: "required",
    rpID: rpId,
  };
  const options = await generateAuthenticationOptions(opts);

  await saveSession({ currentChallenge: options.challenge, email });

  return {
    success: true,
    data: options,
  };
};

export const verifyWebAuthnLogin = async (data: AuthenticationResponseJSON) => {
  const {
    data: { email, currentChallenge },
  } = await getOrCreateSession();

  if (!email || !currentChallenge) {
    return {
      success: false,
      message: "Session expired login",
    };
  }

  const user = await find(email);

  if (!user) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const dbAuthenticator = user.devices.find(
    (dev) => dev.credentialID === data.rawId
  );

  if (!dbAuthenticator) {
    return {
      success: false,
      message: "Authenticator is not registered with this site",
    };
  }

  const opts: VerifyAuthenticationResponseOpts = {
    response: data,
    expectedChallenge: `${currentChallenge}`,
    expectedOrigin: origin,
    expectedRPID: rpId,
    authenticator: {
      ...dbAuthenticator,
      credentialID: dbAuthenticator.credentialID,
      credentialPublicKey: isoBase64URL.toBuffer(
        dbAuthenticator.credentialPublicKey
      ),
    },
    requireUserVerification: true,
  };
  const verification = await verifyAuthenticationResponse(opts);

  await saveSession({});

  return {
    success: verification.verified,
  };
};
