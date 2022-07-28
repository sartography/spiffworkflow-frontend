import { BACKEND_BASE_URL } from '../config';

const doLogin = () => {
  const redirctUrl = `${window.location.origin}${window.location.pathname}`;
  const url = `${BACKEND_BASE_URL}/login?redirect_url=${redirctUrl}`;
  window.location.href = url;
};
const getIdToken = () => {
  return sessionStorage.getItem('jwtIdToken');
};

const doLogout = () => {
  const idToken = getIdToken();
  sessionStorage.removeItem('jwtAccessToken');
  sessionStorage.removeItem('jwtIdToken');
  const redirctUrl = `${window.location.origin}/`;
  const url = `${BACKEND_BASE_URL}/logout?redirect_url=${redirctUrl}&id_token=${idToken}`;
  window.location.href = url;
};

const getAuthToken = () => {
  return sessionStorage.getItem('jwtAccessToken');
};
const isLoggedIn = () => {
  return !!getAuthToken();
};
const getUsername = () => 'tmpuser';

// FIXME: we could probably change this search to a hook
// and then could use useSearchParams here instead
const getAuthTokenFromParams = () => {
  const queryParams = window.location.search;
  const access_token = queryParams.match(/.*\baccess_token=([^=]+).*/);
  const id_token = queryParams.match(/.*\bid_token=([^=]+).*/);
  if (access_token) {
    const authToken = access_token[1];
    sessionStorage.setItem('jwtAccessToken', authToken);
  }
  if (id_token) {
    const authToken = id_token[1];
    sessionStorage.setItem('jwtIdToken', authToken);
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
