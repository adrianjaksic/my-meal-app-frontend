<template>
  <v-app>
    <v-app-bar
      app
      color="grey darken-4"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="MDC Logo"
          class="shrink mr-2"
          contain
          src="./assets/mdc-logo-big.png"
          transition="scale-transition"
          height="40"
          width="40"
        />

        <v-img
          alt="MDC Name"
          class="shrink hidden-xs-only"
          contain
          src="./assets/mdc-text-big.png"
          height="40"
          width="60"
        />
      </div>

      <label>{{fullname}}</label>

      <router-link
          tag="div"
          to="/"
          v-show="isLoggedIn"
      >
          <v-btn text>
              <v-icon>mdi-food</v-icon>
              <span class="ml-2">My meals</span>
          </v-btn>
      </router-link>

      <router-link
          tag="div"
          to="/settings"
          v-show="isLoggedIn"
      >
          <v-btn text>
              <v-icon>mdi-settings</v-icon>
              <span class="ml-2">Settings</span>
          </v-btn>
      </router-link>  

      <router-link
          tag="div"
          to="/users"
          v-show="isLoggedIn && seeUsers"
      >
          <v-btn text>
              <v-icon>mdi-account-multiple</v-icon>
              <span class="ml-2">Users</span>
          </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <router-link
          tag="div"
          to="/register"
          v-show="!isLoggedIn"
      >
          <v-btn text>
              <v-icon>mdi-account</v-icon>
              <span class="ml-2">Register</span>
          </v-btn>
      </router-link>

      <router-link
          tag="div"
          to="/login"
          v-show="!isLoggedIn"
      >
          <v-btn text>
              <v-icon>mdi-login-variant</v-icon>
              <span class="ml-2">Login</span>
          </v-btn>
      </router-link> 

      <v-btn text
          v-show="isLoggedIn"
          v-on:click="logOff"
      >
          <v-icon>mdi-logout-variant</v-icon>
          <span class="ml-2">Logoff</span>
      </v-btn>    
    </v-app-bar>
    
    <router-view @viewChenged="checkLoggedIn"></router-view>
  </v-app>
</template>

<script>
import AuthService from './services/auth-service'

export default {
  name: 'App',

  data: () => ({
      auth: new AuthService,
      isLoggedIn: false,
      seeUsers: false,
      fullname: ""
  }),

  methods: {
      checkLoggedIn() {
        let user = this.auth.getUser();
        if (user != null) {
          let selectedUser = this.auth.getSelectedUser();
          this.isLoggedIn = true;
          this.seeUsers = user.roleName != "User";
          if (selectedUser != null && user.fullName != selectedUser.fullName) {
            this.fullname = user.fullName + "/" + selectedUser.fullName;
          } else {
            this.fullname = user.fullName;
          }
        } else {
          this.isLoggedIn = false;
          this.seeUsers = false;
          this.fullname = "";
        }
      },
      async logOff() {
        let this1 = this;
        await this.auth.logoff().then(function() {
            this1.$router.push({ path: '/login'})
            this1.checkLoggedIn();
        }).catch(function() {
        });
      }
  },

  created: function () {
    this.checkLoggedIn();
  }
}
</script>
