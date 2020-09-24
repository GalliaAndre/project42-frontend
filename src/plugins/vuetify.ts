import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#f47730'
      },
      dark: {
        primary: '#f47730'
      }
    }
  }
});
