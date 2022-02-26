import store from '@/store/store';

/**
 * Composable function that dispatches the VueX action that sets the boolean
 * value watched by the ProgressBar component to true.
 */
export function turnOnLoadingBar() {
  store.dispatch('setIsLoading', true).catch(error => console.log(error));
}

/**
 * Composable function that dispatches the VueX action that sets the boolean
 * value watched by the ProgressBar component to true.
 */
export function turnOffLoadingBar() {
  store.dispatch('setIsLoading', false).catch(error => console.log(error));
}
