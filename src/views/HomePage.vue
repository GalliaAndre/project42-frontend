<template>
  <div class="home-page" ref="scroller">
    <h1 class="home-page-header">
      <img src="../assets/logo-sorint.png" class="home-page-logo" />

      <v-autocomplete
        class="home-page-category-filter"
        v-model="categoryFilter"
        item-text="description"
        item-value="id"
        :items="categoryOptions"
        label="Filter by categories..."
        multiple
        chips
        :deletable-chips="true"
        dark
        @change="loadSections() && loadCategories()"
      ></v-autocomplete>
    </h1>

    <section>
      <SectionList
        :sections="sections"
        v-if="!isSectionLoading && !hasSectionError"
      />

      <Spinner v-if="isSectionLoading" />

      <ErrorPlaceholder @reload="loadSections()" v-if="hasSectionError" />
    </section>

    <div class="home-page-divider" ref="divider">
      <img src="../assets/logo.png" class="home-page-divider-logo" />
    </div>

    <section>
      <h2 class="home-page-header">Categories</h2>

      <template v-if="!isCategoryLoading && !hasCategoryError">
        <CategoryList :categories="categories" />

        <v-pagination
          class="home-page-pagination"
          dark
          v-model="page"
          :length="totalPages"
          :total-visible="10"
          @input="onPgaeChange()"
        ></v-pagination>
      </template>

      <Spinner v-if="isCategoryLoading" />

      <ErrorPlaceholder @reload="loadCategories()" v-if="hasCategoryError" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import {
  Category,
  Section,
  HomeResponse,
  CategoryPageResponse
} from '@/store/model';
import Backend from '@/backend';

@Component
export default class HomePage extends Vue {
  // Refs
  @Ref() scroller: HTMLElement;
  @Ref() divider: HTMLElement;

  // Data
  sections: Section[] = [];
  categories: Category[] = [];
  categoryOptions: Category[] = [];
  totalPages: number;
  isSectionLoading = false;
  hasSectionError = false;
  isCategoryLoading = false;
  hasCategoryError = false;
  categoryFilter: number[] = [];
  page = 1;

  // Hooks
  created(): void {
    this.loadSections();
    this.loadCategories();
    this.loadCategoryOptions();
  }

  // Methods
  async loadSections(): Promise<void> {
    const filter = this.categoryFilter.join(',') || null;
    this.isSectionLoading = true;
    this.hasSectionError = false;

    return Backend.get<HomeResponse>('home', { categories: filter })
      .then(response => {
        const sections: Section[] = [
          {
            title: 'Latest videos',
            items: response.latestVideos
          },
          {
            title: 'Latest series',
            items: response.latestSeries
          },
          {
            title: 'Most watched videos',
            items: response.mostViewedVideos
          },
          {
            title: 'Most watched series',
            items: response.mostViewedSeries
          },
          {
            title: 'Top videos',
            items: response.topRatedVideos
          },
          {
            title: 'Top series',
            items: response.topRatedSeries
          }
        ];

        this.sections = sections;
      })
      .catch(() => (this.hasSectionError = true))
      .then(() => {
        this.isSectionLoading = false;
      });
  }

  async loadCategories(): Promise<void> {
    const filter = this.categoryFilter.join(',') || null;
    this.isCategoryLoading = true;
    this.hasCategoryError = false;

    return Backend.get<CategoryPageResponse>('categories/page', {
      filter,
      page: this.page
    })
      .then(response => {
        this.categories = response.items;
        this.totalPages = response.totalPages;
      })
      .catch(() => (this.hasCategoryError = true))
      .then(() => {
        this.isCategoryLoading = false;
      });
  }

  async loadCategoryOptions(): Promise<void> {
    return Backend.get<Category[]>('categories').then(response => {
      this.categoryOptions = response;
    });
  }

  onPgaeChange(): void {
    this.scroller.scroll(0, this.divider.offsetTop);
    this.loadCategories();
  }
}
</script>

<style scoped>
.home-page {
  color: white;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.home-page-header {
  display: flex;
  flex-wrap: wrap;
  font-size: 38px;
  font-weight: normal;
  justify-content: space-between;
  padding: 25px 25px 0 25px;
}

.home-page-logo {
  height: 45px;
  margin-bottom: 20px;
}

.home-page-category-filter {
  flex-grow: 0;
  flex-shrink: 0;
  margin: 0;
  max-width: 100%;
  padding: 0;
  width: 600px;
}

@media all and (max-width: 850px) {
  .home-page-category-filter {
    width: 100%;
  }
}

.home-page-divider {
  align-items: center;
  display: flex;
  height: 120px;
  justify-content: center;
}

.home-page-divider-logo {
  max-width: 80%;
  width: 400px;
}

.home-page-pagination {
  padding: 30px;
}
</style>
