<template>
  <div class="mt-12">
    <div class="mx-auto mt-5">
      <h1>Users</h1>
      <v-btn                               
        color="primary"
        @click="setNewUser()">
        New user
      </v-btn>
      <v-container>
        <v-row>
          <v-col lg="9">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Email</th>
                    <th class="text-left">Full name</th>
                    <th class="text-left">Role name</th>
                    <th class="text-left">Active</th>
                    <th></th>
                    <th v-if="isAdmin"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in users" :key="item.userId">
                    <td>{{ item.email }}</td>
                    <td>{{ item.fullName }}</td>
                    <td>{{ item.roleName }}</td>
                    <td>{{ item.active }}</td>
                    <td class="text-right">
                      <v-btn                               
                        color="primary"
                        @click="setUser(item.userId)">
                        Edit
                      </v-btn>
                    </td>
                    <td class="text-right" v-if="isAdmin">
                      <v-btn                               
                        color="primary"
                        @click="selectUser(item)">
                        Select user
                      </v-btn>
                    </td>                 
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col lg="3">
            <v-card>
              <v-form class="ma-2" v-if="user != null">
                <h2 >{{editTitle}}</h2>
                <v-text-field
                  v-if="user.userId == 0"
                  v-model="user.email"
                  label="Email"
                  prepend-icon="mdi-account-circle"
                />

                <v-text-field              
                  label="Fullname"
                  v-model="user.fullName"
                  prepend-icon="mdi-account-edit"
                />

                <v-radio-group v-model="user.roleName" column>
                  <v-radio v-for="item in roles" v-bind:key="item" :label="item" :value="item"></v-radio>
                </v-radio-group>

                <v-text-field
                  v-if="user.userId == 0"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="user.password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                />

                <v-checkbox label="Active" v-model="user.active" light></v-checkbox>

                <v-btn                               
                  color="primary"
                  @click="saveUser()">
                  Save user
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>             
      </v-container>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth-service'
import UserService from '../services/user-service'

export default {
  name: 'Users',

  data: () => ({
    authService: new AuthService,
    userService: new UserService,
    roles: [],
    users: [],
    editTitle: "Edit user",
    user: null,
    showPassword: false,
    isAdmin: false
  }),

  methods: {
    async getRoles() {
      this.roles = await this.userService.getRoles();
    },
    
    async getAllUsers() {
      this.users = await this.userService.getUsers();
    },

    async setUser(id) {
      this.user = await this.userService.getUser(id);
      this.editTitle = "Edit user: " + this.user.email;
    },    

    async setNewUser() {
      this.user = { userId: 0, email: "", fullName: "", password: "", roleName: "User", active: true };
      this.editTitle = "Adding new user";
    },
    
    async saveUser() {
      let this1 = this;
      let newUser = this.user.userId == 0;
      let user = await this.userService.createOrUpdateUser(this.user.userId, this.user.email, this.user.fullName, this.user.password, this.user.roleName, this.user.active);
      if (user.changedRole) {
        this.authService.logoff();
        this1.$emit('viewChenged');
        this.checkForRedirect();
      }      
      this.user = user;
      this.editTitle = "Edit user: " + user.email;
      if (newUser) {
        this.users.push(user);
      } else {
        this.users.forEach(function(element) {
          if (element.userId == user.userId) {             
            element.fullName = user.fullName;
            element.roleName = user.roleName;
            element.active = user.active;
          }
        });
      }
    },

    selectUser(user) {
      this.authService.updateSelectedUser(user);
      this.$emit('viewChenged');
    },

    checkForRedirect() {
      let user = this.authService.getUser();
      if (user == null) {
        this.$router.push({ path: '/login'})
      } else if (user.roleName == 'User') {
        this.$router.push({ path: '/'})
      }
    }
  },

  created: function () {
    this.checkForRedirect();
    let user = this.authService.getUser();
    if (user.roleName == 'Admin') {
      this.isAdmin = true;
    }
    this.getAllUsers();
    this.getRoles();
  }
}
</script>