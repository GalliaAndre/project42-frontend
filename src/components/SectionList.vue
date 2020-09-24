<template>
  <div class="section-list">
    <div
      class="section-list-row"
      v-for="section in sections"
      :key="section.name"
    >
      <h2 class="section-list-title">{{ section.title }}</h2>

      <Carousel :items="section.items" v-if="section.items.length" />

      <EmptyPlaceholder v-else />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Section } from '@/store/model';

@Component
export default class SectionList extends Vue {
  @Prop() readonly sections: Section[];
}
</script>

<style scoped>
.section-list-row {
  padding: 30px;
}

.section-list-title {
  font-weight: normal;
  margin-bottom: 20px;
}
</style>
