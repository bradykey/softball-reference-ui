<template>
  <v-card :flat="flat" elevation="0" color="transparent">
    <v-card-title
      class="d-flex align-center text-h5 text-sm-h3 font-weight-bold"
    >
      {{ title }}
      <v-divider class="mx-4" vertical></v-divider>
      <v-chip
        v-if="titleChipText"
        :color="titleChipColor"
        :size="display.smAndUp.value ? 'default' : 'small'"
        :variant="outlinedChip ? 'outlined' : 'flat'"
        :ripple="false"
      >
        {{ titleChipText }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle class="text-subtitle-2 text-sm-subtitle-1">
      {{ subtitle }}
    </v-card-subtitle>
    <v-divider v-if="divider" class="mt-3" :color="dividerColor" />
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify';
import CustomColors from '@/plugins/vuetify/theme';
export default {
  name: 'TitleCard',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    titleChipText: {
      type: String,
      default: ''
    },
    titleChipColor: {
      type: String,
      default: ''
    },
    flat: {
      type: Boolean,
      default: false
    },
    divider: {
      type: Boolean,
      default: false
    },
    outlinedChip: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const display = useDisplay();
    const dividerColor = CustomColors.softball_grey;

    return {
      display,
      dividerColor
    };
  }
};
</script>
