<template>
  <v-alert class="empty-placeholder" prominent dense type="info" :color="color">
    No content available
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EmptyPlaceholder extends Vue {
  @Prop({ default: 'indigo lighten-2' }) readonly color: string;
}
</script>

<style scoped>
.empty-placeholder {
  margin-bottom: 0;
}
</style>
