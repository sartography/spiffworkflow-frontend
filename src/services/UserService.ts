import Keycloak from 'keycloak-js';

const keycloakClient = new Keycloak('/keycloak.json');

const doLogin = keycloakClient.login;

const doLogout = keycloakClient.logout;

const getToken = () => keycloakClient.token;

const isLoggedIn = () => !!keycloakClient.token;

const updateToken = (successCallback: any) =>
  keycloakClient.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => keycloakClient.tokenParsed?.preferred_username;

const hasRole = (roles: string[]) =>
  roles.some((role: string) => keycloakClient.hasRealmRole(role));

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: any) => {
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
