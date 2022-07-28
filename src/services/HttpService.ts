import { BACKEND_BASE_URL } from '../config';
import { objectIsEmpty } from '../helpers';
import UserService from './UserService';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const getBasicHeaders = (): object => {
  if (UserService.isLoggedIn()) {
    return {
      Authorization: `Bearer ${UserService.getAuthToken()}`,
    };
  }
  return {};
};

type backendCallProps = {
  path: string;
  successCallback: Function;
  httpMethod?: string;
  extraHeaders?: object;
  postBody?: any;
};

class UnauthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}

const makeCallToBackend = ({
  path,
  successCallback,
  httpMethod = 'GET',
  extraHeaders = {},
  postBody = {},
}: backendCallProps) => {
  const headers = getBasicHeaders();

  if (!objectIsEmpty(extraHeaders)) {
    Object.assign(headers, extraHeaders);
  }

  const httpArgs = {};

  if (postBody instanceof FormData) {
    Object.assign(httpArgs, { body: postBody });
  } else if (typeof postBody === 'object') {
    if (!objectIsEmpty(postBody)) {
      Object.assign(httpArgs, { body: JSON.stringify(postBody) });
      Object.assign(headers, { 'Content-Type': 'application/json' });
    }
  } else {
    Object.assign(httpArgs, { body: postBody });
  }

  Object.assign(httpArgs, {
    headers: new Headers(headers as any),
    method: httpMethod,
  });

  fetch(`${BACKEND_BASE_URL}${path}`, httpArgs)
    .then((response) => {
      // if (response.status === 401) {
      if (response.status !== 200) {
        UserService.doLogin();
        throw new UnauthenticatedError('You must be authenticated to do this.');
      }
      return response.json();
    })
    .then((result: object) => {
      successCallback(result);
    })
    .catch((error) => {
      if (error.name !== 'UnauthenticatedError') {
        console.log(error.message);
      }
    });
};

const HttpService = {
  HttpMethods,
  makeCallToBackend,
};

export default HttpService;
