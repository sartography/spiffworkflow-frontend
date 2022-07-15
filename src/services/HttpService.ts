import axios from 'axios';
import { BACKEND_BASE_URL } from '../config';
import UserService, { STANDARD_HEADERS } from './UserService';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const axiosClient = axios.create();

const configure = () => {
  axiosClient.interceptors.request.use((config) => {
    console.log('WE CALL INTER');
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
};

const makeCallToBackend = ({
  path,
  successCallback,
  httpMethod = 'GET',
  extraHeaders = {},
}: backendCallProps) => {
  const headers = STANDARD_HEADERS;
  if (extraHeaders) {
    Object.assign(headers, extraHeaders);
  }
  fetch(`${BACKEND_BASE_URL}${path}`, {
    headers: new Headers(headers),
    method: httpMethod,
  })
    .then((res) => res.json())
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
