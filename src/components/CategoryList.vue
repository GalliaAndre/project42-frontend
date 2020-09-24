<template>
  <div class="category-list">
    <div
      class="category-list-row"
      v-for="category in categories"
      :key="category.id"
    >
      <h2 class="category-list-title">{{ category.description }}</h2>

      <template v-if="category.videos.length">
        <h4 class="category-list-subtitle">List of videos</h4>
        <Carousel :items="category.videos" />
      </template>

      <template v-if="category.series.length">
        <h4 class="category-list-subtitle">List of series</h4>
        <Carousel :items="category.series" />
      </template>

      <EmptyPlaceholder
        v-if="!category.videos.length && !category.series.length"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Category } from '@/store/model';

@Component
export default class CategoryList extends Vue {
  @Prop() readonly categories: Category[];
}
</script>

<style scoped>
.category-list-row {
  background-color: #222;
  padding: 30px;
}

.category-list-title {
  font-weight: normal;
  margin-bottom: 20px;
}

.category-list-subtitle {
  font-weight: normal;
  margin-bottom: 10px;
}

.carousel + .category-list-subtitle {
  margin-top: 20px;
}
</style>
