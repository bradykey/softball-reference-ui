import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: true },
  icons: {
    values: {
      sort: 'mdi-arrow-down'
    }
  }
});
