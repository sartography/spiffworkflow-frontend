const host = window.location.hostname;
const hostAndPort = `${host}:7000`;

export const BACKEND_BASE_URL = `http://${hostAndPort}/v1.0`;

let authTokenForEnv =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.krsOjlSilPMu_3r7WkkUfKyr-h3HprXr6R4_FXRXz6Y';
if (hostAndPort.startsWith('167')) {
  authTokenForEnv =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.8XDyKOmBisGUqtGWwoEHg_Crvp-2YcxTfAFnCb4L6_k';
}

export const HOT_AUTH_TOKEN = authTokenForEnv;

export const STANDARD_HEADERS = {
  headers: new Headers({
    Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
  }),
};

export const PROCESS_STATUSES = [
  'all',
  'not_started',
  'user_input_required',
  'waiting',
  'complete',
  'faulted',
  'suspended',
];

export const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const AUTH_WITH_KEYCLOAK = false;
