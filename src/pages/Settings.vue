<template>
  <div class="mt-12">
    <div class="mx-auto mt-5">
      <h1>Settings</h1>
      <v-text-field
        v-model="dailyNumberOfCalories"
        type="number"
        label="Daily number of calories"
      />
      <v-btn                               
        color="primary"
        @click="saveSettings()">
        Save settings
      </v-btn>   
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth-service'
import MealService from '../services/meal-service'

export default {
  name: 'Users',

  data: () => ({
    authService: new AuthService,
    mealService: new MealService,
    dailyNumberOfCalories: 0,
  }),

  methods: {
    async saveSettings() {
      if (this.dailyNumberOfCalories != undefined) {
        let settings = await this.mealService.saveSettings(this.selectedUserId, Number(this.dailyNumberOfCalories));
        this.dailyNumberOfCalories = settings.dailyNumberOfCalories;
      }
    },

    checkForRedirect() {
      let user = this.authService.getUser();
      if (user == null) {
        this.$router.push({ path: '/login'})
      }
    }
  },

  created: async function () {
    this.checkForRedirect();
    let user = this.authService.getSelectedUser();
    if (user == null) {
      user = this.authService.getUser();
    }
    this.selectedUserId = user.userId;
    let settings = await this.mealService.getSettings(this.selectedUserId);
    this.dailyNumberOfCalories = settings.dailyNumberOfCalories;
  }
}
</script>