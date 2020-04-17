import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import DatetimePicker from 'vuetify-datetime-picker';

import Login from "./pages/Login";
import Meals from "./pages/Meals";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import 'sweetalert2/dist/sweetalert2.min.css';
import "vuetify-datetime-picker/src/stylus/main.styl";

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.use(VueSweetalert2);
Vue.use(DatetimePicker);
Vue.use(require('vue-moment'));

const routes = [
  { path: '/', component: Meals },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/users', component: Users },
  { path: '/settings', component: Settings }, 
  { path: '*', redirect: '/' }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  VueRouter,
  vuetify,
  render: h => h(App),
  router
}).$mount('#app');
