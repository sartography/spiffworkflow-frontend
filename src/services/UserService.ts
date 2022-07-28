import { BACKEND_BASE_URL } from '../config';

let authToken: string = '';

const doLogin = () => {
  const redirctUrl = `${window.location.origin}${window.location.pathname}`;
  const url = `${BACKEND_BASE_URL}/login_redirect?redirect_url=${redirctUrl}`;
  window.location.href = url;
};

const doLogout = () => {
  authToken = '';
};

const getAuthToken = () => authToken;
const isLoggedIn = () => !!authToken;
const getUsername = () => 'tmpuser';

// FIXME: we could probably change this search to a hook
// and then could use useSearchParams here instead
const getAuthTokenFromParams = () => {
  const queryParams = window.location.search;
  const token = queryParams.match(/.*\btoken=([^=]+).*/);
  if (token) {
    authToken = token[1];
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
