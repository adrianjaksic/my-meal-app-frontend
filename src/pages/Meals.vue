<template>
  <div class="mt-12">
    <div class="mx-auto mt-5">
      <h1>Meals</h1>    
      <v-btn                               
        color="primary"
        @click="setNewMeal()">
        New meal
      </v-btn>
      <v-container>
        <v-row>
          <v-datetime-picker
            label="From date"
            dateFormat="MM/dd/yyyy"
            timeFormat=""
            v-model="fromDate">
          </v-datetime-picker> 
          <v-datetime-picker
            label="To date"
            dateFormat="MM/dd/yyyy"
            timeFormat=""
            v-model="toDate">
          </v-datetime-picker> 
          <v-datetime-picker
            label="From time"
            dateFormat=""
            v-model="fromTime">
          </v-datetime-picker> 
          <v-datetime-picker
            label="To time"
            dateFormat=""
            v-model="toTime">
          </v-datetime-picker>          
        </v-row>
      <v-btn                               
        color="primary"
        @click="getAllMeals()">
        Apply
      </v-btn>
      </v-container>

      <v-container>
        <v-row>
          <v-col lg="9">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Date and time</th>              
                    <th class="text-left">Description</th>
                    <th class="text-left">Calories</th>
                    <th class="text-left">Created</th>
                    <th class="text-left">Modified</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr :class="item.color" v-for="item in meals" :key="item.mealId">
                    <td>{{ item.date | moment }}</td>                 
                    <td>{{ item.description }}</td>
                    <td>{{ item.calories }}</td>
                    <td>{{ item.created | moment }}</td>
                    <td>{{ item.modified | moment }}</td>                 
                    <td class="text-right">
                      <v-btn                               
                        color="primary"
                        @click="setMeal(item.mealId)">
                        Edit
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col lg="3">
            <v-card>
              <v-form class="ma-2" v-if="meal != null">
                <h2 >{{editTitle}}</h2>
                
                <v-datetime-picker
                  label="Date and time"
                  dateFormat="MM/dd/yyyy"
                  v-model="date">
                </v-datetime-picker>

                <v-text-field
                  v-model="meal.description"
                  label="Description"
                />

                <v-text-field
                  v-model="meal.calories"
                  type="number"
                  label="Calories"
                />

                <v-btn                               
                  color="primary"
                  @click="saveMeal()">
                  Save meal
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
import MealService from '../services/meal-service'
import moment from 'moment'

export default {
  name: 'Meals',

  data: () => ({
    authService: new AuthService,
    mealService: new MealService,
    meals: [],
    editTitle: "Edit meal",
    meal: null,
    date: null,
    selectedUserId: null,
    dailyNumberOfCalories: 0,
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  }),

  filters: {
    moment: function (date) {
      return moment(date).format('MM/DD/YYYY HH:mm');
    }
  },

  methods: {    
    async getAllMeals() {
      let fromDate = this.fromDate != null ? moment(this.fromDate).format('YYYY-MM-DD') : null;
      let toDate = this.toDate != null ? moment(this.toDate).format('YYYY-MM-DD') : null;
      let fromTime = this.fromTime != null ? moment(this.fromTime).format('HH:mm') : null;
      let toTime = this.toTime != null ? moment(this.toTime).format('HH:mm') : null;   
      this.meals = await this.mealService.getMeals(this.selectedUserId, fromDate, toDate, fromTime, toTime);
      this.calculateMaxCalories();
    },

    async setMeal(id) {
      this.meal = await this.mealService.getMeal(this.selectedUserId, id);
      this.editTitle = "Edit meal";
      this.date = moment(this.meal.date).format('MM/DD/YYYY HH:mm');
    },    

    async setNewMeal() {
      this.meal = { mealId: 0, description: null, date: null, calories: null };
      this.date = moment().format('MM/DD/YYYY HH:mm');
      this.editTitle = "Adding new meal";
    },
    
    async saveMeal() {
      let newMeal = this.meal.mealId == 0;
      let date = moment(this.date).format('YYYY-MM-DDTHH:mm:00Z');
      let meal = await this.mealService.createOrUpdateUser(this.selectedUserId, this.meal.mealId, date, this.meal.description, Number(this.meal.calories));
      this.meal = meal;
      this.editTitle = "Edit meal";
      if (newMeal) {
        this.meals.push(meal);
      } else {
        this.meals.forEach(function(element) {
          if (element.mealId == meal.mealId) {             
            element.description = meal.description;
            element.date = meal.date;
            element.calories = meal.calories;
            element.modified = meal.modified;
          }
        });
        this.calculateMaxCalories();
      }
    },

    calculateMaxCalories() {
      var dailyNumberOfCalories = this.dailyNumberOfCalories;
      var day = null;
      var elems = [];
      var maxCal = 0;
      if (dailyNumberOfCalories > 0) {
        this.meals.forEach(function(element) {
          element.day = moment(element.date).format('YYYY-MM-DD');
          element.color = "text-green";
          if (day != null && day != element.day) {                
            if (maxCal > dailyNumberOfCalories) {
              elems.forEach(function(el) {
                el.color = "text-red";
              });
            }
            maxCal = 0;
            elems = [];
          }
          maxCal += element.calories;
          elems.push(element);
          day = element.day;
        });
        if (maxCal > dailyNumberOfCalories) {
          elems.forEach(function(el) {
            el.color = "text-red";
          });
        }
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
    this.getAllMeals();
  }
}
</script>

<style scoped>

.text-red {
  color: red;
}

.text-green {
  color: green;
}
</style>