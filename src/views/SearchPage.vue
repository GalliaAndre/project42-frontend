<template>
  <div class="search-page">
    <h1 class="search-page-header">
      <v-btn icon dark @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      Search: "{{ $route.params.key }}"
    </h1>

    <Spinner v-if="isLoading" />

    <ErrorPlaceholder @reload="load()" v-if="hasError" />

    <template v-if="!isLoading && !hasError">
      <SectionList :sections="sections" />
      <CategoryList :categories="categories" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Category, Section, SearchResponse } from '@/store/model';
import Backend from '@/backend';

@Component
export default class SearchPage extends Vue {
  // Data
  sections: Section[] = [];
  categories: Category[] = [];
  isLoading = false;
  hasError = false;

  // Hooks
  created(): void {
    this.load();
  }

  // Watchers
  @Watch('$route')
  load(): void {
    this.isLoading = true;
    this.hasError = false;

    Backend.get<SearchResponse>('search', { q: this.$route.params.key })
      .then(response => {
        const videos = response.videos || [];
        const series = response.series || [];
        this.categories = response.categories || [];

        this.sections = [
          {
            title: `Videos results (${videos.length})`,
            items: videos
          },
          {
            title: `Series results (${series.length})`,
            items: series
          }
        ];
      })
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }
}
</script>

<style scoped>
.search-page {
  color: white;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.search-page-header {
  font-size: 38px;
  font-weight: normal;
  padding: 25px 25px 0 25px;
}
</style>
