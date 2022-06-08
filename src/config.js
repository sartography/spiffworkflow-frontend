var hostAndPort;
if (window.location.href.indexOf("167.172.242.138") > -1) {
  hostAndPort = "167.172.242.138:7000"
} else {
  hostAndPort = "localhost:5010"
}
export const BACKEND_BASE_URL = `http://${hostAndPort}/v1.0`
export const HOT_AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOm51bGx9.krsOjlSilPMu_3r7WkkUfKyr-h3HprXr6R4_FXRXz6Y"
