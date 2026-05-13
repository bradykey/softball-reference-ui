import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import CustomColors from '@/plugins/vuetify/theme.js';

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          ...CustomColors
        }
      }
    }
  }
});
