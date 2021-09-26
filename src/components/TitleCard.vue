<template>
  <v-card :flat="flat" color="transparent">
    <v-card-title class="text-h5 text-sm-h3 font-weight-bold">
      {{ title }}
      <v-divider class="mx-4" vertical></v-divider>
      <v-chip
        v-if="titleChipText"
        :color="titleChipColor"
        :medium="$vuetify.breakpoint.smAndUp"
        :small="$vuetify.breakpoint.smOnly || $vuetify.breakpoint.xsOnly"
        outlined
        :ripple="false"
        dark
      >
        {{ titleChipText }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle
      class="text-subtitle-2 text-sm-subtitle-1"
      :style="divider ? titleCardDividerStyle : ''"
    >
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text class="text-body-1">
      {{ text }}
    </v-card-text>
  </v-card>
</template>

<script>
import { ref } from '@vue/composition-api';
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
      required: ''
    },
    text: {
      type: String,
      default: ''
    },
    titleChipText: {
      type: String,
      required: ''
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
    }
  },
  setup() {
    const titleCardDividerStyle = ref(
      'box-shadow: 0px 3px 0px ' + CustomColors.softball_grey
    );

    return {
      titleCardDividerStyle
    };
  }
};
</script>
