<template>
  <v-app>
    <AppBar />

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AppBar from '@/components/AppBar.vue';

export default Vue.extend({
  name: 'App',

  components: {
    AppBar
  }
});
</script>

<style scoped>
.v-content {
  background-color: #111;
  height: calc(100vh - 60px);
  margin-top: 60px;
}
</style>
