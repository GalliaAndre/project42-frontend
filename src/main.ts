import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import './assets/style.css';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import axios from 'axios';
import Spinner from '@/components/Spinner.vue';
import ErrorPlaceholder from '@/components/ErrorPlaceholder.vue';
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue';
import Carousel from '@/components/Carousel.vue';
import CategoryList from '@/components/CategoryList.vue';
import SectionList from '@/components/SectionList.vue';
import { Environment } from './store/model';

Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);

// Global components
Vue.component('Spinner', Spinner);
Vue.component('ErrorPlaceholder', ErrorPlaceholder);
Vue.component('EmptyPlaceholder', EmptyPlaceholder);
Vue.component('Carousel', Carousel);
Vue.component('CategoryList', CategoryList);
Vue.component('SectionList', SectionList);

axios.get<Environment>('/config/environment.json').then(response => {
  Vue.prototype.$env = response.data;

  Vue.use(VueKeyCloak, {
    config: response.data.keycloak,
    onReady: () => {
      new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
      }).$mount('#app');
    }
  });
});
