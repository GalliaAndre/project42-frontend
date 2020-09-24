<template>
  <v-alert class="error-placeholder" prominent dense type="error">
    <v-row align="center">
      <v-col class="grow">An error occurred during loading.</v-col>
      <v-col class="shrink">
        <v-btn @click="$emit('reload')">Try again</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ErrorPlaceholder extends Vue {}
</script>

<style scoped>
.error-placeholder {
  margin: 25px;
}
</style>
