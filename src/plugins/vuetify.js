import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import CustomTheme from '@/plugins/vuetify/theme.js';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      CustomTheme
    },
    dark: true
  }
});
