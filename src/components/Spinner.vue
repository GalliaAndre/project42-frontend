<template>
  <div class="spinner" :class="{ block }">
    <v-progress-circular
      :color="color"
      :size="size"
      :width="5"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Spinner extends Vue {
  // Input
  @Prop({ default: true }) readonly block: boolean;
  @Prop({ default: 'white' }) readonly color: string;
  @Prop({ default: 80 }) readonly size: number;
}
</script>

<style scoped>
.spinner {
  padding: 5px 15px;
}

.spinner.block {
  display: block;
  padding: 60px;
  text-align: center;
}
</style>
