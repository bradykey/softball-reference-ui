<template>
  <div :style="divider ? titleCardDividerStyle : ''">
    <v-card :flat="flat" color="transparent">
      <v-card-title class="text-h3 font-weight-bold">
        <v-chip
          v-if="id"
          class="mr-3"
          color="primary"
          medium
          :ripple="false"
          dark
        >
          {{ id }}
        </v-chip>
        {{ title }}
        <v-spacer />
        <v-chip
          v-if="titleChipText"
          :color="titleChipColor"
          large
          :ripple="false"
          dark
        >
          {{ titleChipText }}
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-2">
        {{ subtitle }}
      </v-card-subtitle>
      <v-card-text class="text-body-1">
        {{ text }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
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
    // TODO: make it be attached to theme colors
    const titleCardDividerStyle = ref('box-shadow: 0px 3px 0px #cf2036');

    return {
      titleCardDividerStyle
    };
  }
};
</script>
