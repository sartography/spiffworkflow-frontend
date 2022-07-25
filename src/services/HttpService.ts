import axios from 'axios';
import { BACKEND_BASE_URL } from '../config';
import { objectIsEmpty } from '../helpers';
import UserService, { STANDARD_HEADERS } from './UserService';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const axiosClient = axios.create();

const configure = () => {
  axiosClient.interceptors.request.use((config) => {
    if (UserService.isLoggedIn()) {
      const cb = () => {
        // @ts-expect-error TS(2532) FIXME: Object is possibly 'undefined'.
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${UserService.getToken()}`;
        return Promise.resolve(config);
      };
      return UserService.updateToken(cb);
    }
    return null;
  });
};

const getAxiosClient = () => axiosClient;

type backendCallProps = {
  path: string;
  successCallback: Function;
  httpMethod?: string;
  extraHeaders?: object;
  postBody?: any;
};

const makeCallToBackend = ({
  path,
  successCallback,
  httpMethod = 'GET',
  extraHeaders = {},
  postBody = {},
}: backendCallProps) => {
  const headers = STANDARD_HEADERS;
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
    headers: new Headers(headers),
    method: httpMethod,
  });

  fetch(`${BACKEND_BASE_URL}${path}`, httpArgs)
    .then((response) => response.json())
    .then(
      (result: object) => {
        successCallback(result);
      },
      (error) => {
        console.log(error);
      }
    );
};

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
  makeCallToBackend,
};

export default HttpService;
