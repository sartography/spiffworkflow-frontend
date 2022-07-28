import { BACKEND_BASE_URL } from '../config';

const doLogin = () => {
  const redirctUrl = `${window.location.origin}${window.location.pathname}`;
  const url = `${BACKEND_BASE_URL}/login?redirect_url=${redirctUrl}`;
  window.location.href = url;
};

const doLogout = () => {
  // TODO: call backend to remove from keycloak as well
  const redirctUrl = `${window.location.origin}/`;
  const url = `${BACKEND_BASE_URL}/logout?redirect_url=${redirctUrl}`;
  window.location.href = url;
  sessionStorage.removeItem('jwtToken');
  // window.location.href = `${window.location.origin}/`;
};

const getAuthToken = () => {
  return sessionStorage.getItem('jwtToken');
};
const isLoggedIn = () => {
  return !!getAuthToken();
};
const getUsername = () => 'tmpuser';

// FIXME: we could probably change this search to a hook
// and then could use useSearchParams here instead
const getAuthTokenFromParams = () => {
  const queryParams = window.location.search;
  const token = queryParams.match(/.*\btoken=([^=]+).*/);
  if (token) {
    const authToken = token[1];
    sessionStorage.setItem('jwtToken', authToken);
  }
};

const hasRole = (_roles: string[]): boolean => {
  return isLoggedIn();
};

const UserService = {
  doLogin,
  doLogout,
  isLoggedIn,
  getAuthToken,
  getAuthTokenFromParams,
  getUsername,
  hasRole,
};

export default UserService;
