<template>
  <v-card width="400" class="mx-auto my-auto">
    <v-card-title>
      <h1 class="display-1">Login</h1>
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          label="Username"
          prepend-icon="mdi-account-circle"
        />

        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          label="Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <router-link
        tag="div"
        to="/register"
      >
        <v-btn color="success">Register</v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <v-btn 
        color="info"
        v-on:click="login"
      >
        Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from '../services/auth-service'

export default {
  name: 'Login',

  data: () => ({
    auth: new AuthService,
    showPassword: false,
    email: "",
    password: ""
  }),

  methods: {
      async login() {       
        let this1 = this;
        let result = await this.auth.login(this.email, this.password);
        if (result.error) {
          this.$swal(result.errorMessage);
        } else {
          this1.checkForRedirect();
          this1.$emit('viewChenged');
        }
      },
      checkForRedirect() {
        let user = this.auth.getUser();
        if (user != null) {
          this.$router.push({ path: '/'})
        }
      }
  },

  created: function () {
    this.checkForRedirect();
  }
}
</script>