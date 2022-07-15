import Keycloak from 'keycloak-js';

import { AUTH_WITH_KEYCLOAK, HOST_AND_PORT } from '../config';

const keycloakClient = new Keycloak('/keycloak.json');

const doLogin = keycloakClient.login;

const doLogout = keycloakClient.logout;

const getToken = () => keycloakClient.token;

const isLoggedIn = () => !!keycloakClient.token;

const updateToken = (successCallback: any) =>
  keycloakClient.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => keycloakClient.tokenParsed?.preferred_username;

const hasRole = (roles: string[]) => {
  if (AUTH_WITH_KEYCLOAK) {
    return roles.some((role: string) => keycloakClient.hasRealmRole(role));
  }

  return true;
};

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: any) => {
  if (AUTH_WITH_KEYCLOAK) {
    keycloakClient
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256',
      })
      .then((authenticated: any) => {
        if (!authenticated) {
          doLogin();
        }
        onAuthenticatedCallback();
      })
      .catch(console.error);
  } else {
    onAuthenticatedCallback();
  }
};

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
};

export default UserService;

// FIXME: Clean this up a bit but first figure out if we want to auth with frontend or just use the backend
let authTokenForEnv =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.krsOjlSilPMu_3r7WkkUfKyr-h3HprXr6R4_FXRXz6Y';
if (HOST_AND_PORT.startsWith('167')) {
  authTokenForEnv =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.8XDyKOmBisGUqtGWwoEHg_Crvp-2YcxTfAFnCb4L6_k';
}
if (AUTH_WITH_KEYCLOAK) {
  authTokenForEnv = UserService.getToken() || '';
}
export const HOT_AUTH_TOKEN = authTokenForEnv;

export const STANDARD_HEADERS = {
  headers: new Headers({
    Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
  }),
};
