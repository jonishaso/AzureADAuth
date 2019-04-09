/** @format */

import {creds} from './config'
export default {
  identityMetadata: creds.identityMetadata,
  clientID: creds.clientID,
  responseType: creds.responseType,
  responseMode: creds.responseMode,
  redirectUrl: creds.redirectUrl,
  allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
  clientSecret: creds.clientSecret,
  validateIssuer: creds.validateIssuer,
  isB2C: creds.isB2C,
  issuer: creds.issuer,
  passReqToCallback: creds.passReqToCallback,
  scope: creds.scope,
  loggingLevel: creds.loggingLevel,
  nonceLifetime: creds.nonceLifetime,
  nonceMaxAmount: creds.nonceMaxAmount,
  useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
  cookieEncryptionKeys: creds.cookieEncryptionKeys,
  clockSkew: creds.clockSkew
}
