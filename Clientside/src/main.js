import Vue from "vue";
import App from "./App.vue";
import jwt_decode from "jwt-decode";
import "@/assets/css/style.css";
const doc = "https://www.googleapis.com/auth/documents";
function onSignIn(response) {
  window.token = response.credential;
  window.identity = jwt_decode(response.credential);
  window.isAuthenticated = true;
  console.log(identity);
}

new Vue({
  render: (h) => h(App),
}).$mount("#app");
