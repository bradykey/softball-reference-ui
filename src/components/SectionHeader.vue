<template>
  <div>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
      <v-chip :color="color" dark :outlined="outlined">
        {{ title }}
      </v-chip>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    },
    outlined: {
      type: Boolean,
      default: false
    }
  }
};
</script>
