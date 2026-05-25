<template>
  <v-container class="d-flex justify-center" style="max-width: 480px">
    <v-card class="pa-6 mt-8" width="100%" color="transparent" elevation="0">
      <h1 class="text-h4 font-weight-bold mb-4">Admin login</h1>
      <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-text-field
          v-model="username"
          label="Username"
          variant="outlined"
          autocomplete="username"
          :rules="[v => !!v || 'Username is required']"
          required
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          autocomplete="current-password"
          :rules="[v => !!v || 'Password is required']"
          required
        />
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>
        <v-btn
          type="submit"
          color="softball_red"
          variant="flat"
          size="large"
          :loading="submitting"
          block
        >
          Log in
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ApiService from '@/services/ApiService';

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const formRef = ref(null);
    const state = reactive({
      username: '',
      password: '',
      submitting: false,
      error: ''
    });

    async function onSubmit() {
      state.error = '';
      const { valid } = await formRef.value.validate();
      if (!valid) return;

      state.submitting = true;
      try {
        const res = await ApiService.login({
          username: state.username,
          password: state.password
        });
        store.dispatch('setAuthToken', res.data.token);
        const redirect = route.query.redirect;
        router.replace(redirect ? String(redirect) : '/');
      } catch (err) {
        const status = err.response && err.response.status;
        state.error =
          status === 401
            ? 'Invalid username or password.'
            : 'Login failed: ' + (err.message || String(err));
      } finally {
        state.submitting = false;
      }
    }

    return { ...toRefs(state), formRef, onSubmit };
  }
};
</script>
