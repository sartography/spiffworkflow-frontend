import { BACKEND_BASE_URL } from '../config';

// NOTE: this currently stores the jwt token in local storage
// which is considered insecure. Server set cookies seem to be considered
// the most secure but they require both frontend and backend to be on the same
// domain which we probably can't guarantee. We could also use cookies directly
// but they have the same XSS issues as local storage.
//
// Some explanation:
// https://dev.to/nilanth/how-to-secure-jwt-in-a-single-page-application-cko

// to trim off any query params
const currentLocation = `${window.location.origin}${window.location.pathname}`;

const doLogin = () => {
  const url = `${BACKEND_BASE_URL}/login?redirect_url=${currentLocation}`;
  window.location.href = url;
};
const getIdToken = () => {
  return localStorage.getItem('jwtIdToken');
};

const doLogout = () => {
  const idToken = getIdToken();
  localStorage.removeItem('jwtAccessToken');
  localStorage.removeItem('jwtIdToken');
  const redirctUrl = `${window.location.origin}/`;
  const url = `${BACKEND_BASE_URL}/logout?redirect_url=${redirctUrl}&id_token=${idToken}`;
  window.location.href = url;
};

const getAuthToken = () => {
  return localStorage.getItem('jwtAccessToken');
};
const isLoggedIn = () => {
  return !!getAuthToken();
};
const getUsername = () => 'tmpuser';

// FIXME: we could probably change this search to a hook
// and then could use useSearchParams here instead
const getAuthTokenFromParams = () => {
  const queryParams = window.location.search;
  const accessTokenMatch = queryParams.match(/.*\baccess_token=([^=]+).*/);
  const idTokenMatch = queryParams.match(/.*\bid_token=([^=]+).*/);
  if (accessTokenMatch) {
    const accessToken = accessTokenMatch[1];
    localStorage.setItem('jwtAccessToken', accessToken);
    if (idTokenMatch) {
      const idToken = idTokenMatch[1];
      localStorage.setItem('jwtIdToken', idToken);
    }
    // to remove token query param
    window.location.href = currentLocation;
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
