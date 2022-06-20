const host = window.location.hostname;
const hostAndPort = `${host}:7000`;

export const BACKEND_BASE_URL = `http://${hostAndPort}/v1.0`
export const HOT_AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.krsOjlSilPMu_3r7WkkUfKyr-h3HprXr6R4_FXRXz6Y"

export const STANDARD_HEADERS = {
  headers: new Headers({
  'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
  })
}
