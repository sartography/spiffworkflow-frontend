import axios from 'axios';
import UserService from './UserService';

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

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
};

export default HttpService;
