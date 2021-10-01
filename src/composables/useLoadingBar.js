import store from '@/store/store';

export function turnOnLoadingBar() {
  store.dispatch('setIsLoading', true).catch(error => console.log(error));
}

export function turnOffLoadingBar() {
  store.dispatch('setIsLoading', false).catch(error => console.log(error));
}
