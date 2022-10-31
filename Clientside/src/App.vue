<template>
   <div id ="app" >
      <div v-if="!googleUser" @click="signIn">Login</div>
  </div>
</template>

<script>
import { toRef, ref } from 'vue';


export default {
  name: 'login_signup_social',

  setup() {
    let googleUser = ref(undefined)
    return { googleUser };
  },

  methods: {
    async signIn() {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '663087561947-sool1ras77qoq8qcq1lr378cip0150qo.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive',
        callback: this.onSignIn,
      });
      client.requestAccessToken();
      /*
      window.isAuthenticated = false;
      google.accounts.id.initialize({
        client_id:
          "545666219040-aog8ekstc4e1da17vtdfbbfmq2euidj6.apps.googleusercontent.com",
        callback: this.onSignIn,
        auto_select: true,
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" } // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
      */
    },
    async onSignIn(user) {
     await fetch(`http://localhost:8083?token=${user.access_token}`,{ mode: 'no-cors'});
      return;
      this.googleUser = user;
      const response = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          "title": "Mein tolles DOC"
        })
      })
      response.json().then(console.log)
    }
  }
}

</script>
