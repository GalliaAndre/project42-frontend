<template>
  <div class="series-page">
    <Spinner v-if="isLoading" />

    <ErrorPlaceholder @reload="load()" v-if="hasError" />

    <div class="series-page-body" v-if="!isLoading && !hasError">
      <div
        class="series-page-cover"
        :style="{
          backgroundImage: 'url(' + getFileUrl(series.bannerName) + ')'
        }"
      >
        <div class="series-page-info">
          <h1 class="series-page-title">
            <v-btn icon dark @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ series.title }}
          </h1>

          <p>{{ series.description }}</p>
        </div>
      </div>

      <Carousel :items="series.videos" v-if="series.videos.length" />

      <EmptyPlaceholder color="transparent" v-else />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Series } from '@/store/model';
import Backend from '@/backend';

@Component
export default class SeriesPage extends Vue {
  // Data
  series = new Series();
  isLoading = false;
  hasError = false;

  // Hooks
  created(): void {
    this.load();
  }

  // Methods
  load(): void {
    this.isLoading = true;
    this.hasError = false;
    const id = this.$route.params.id;

    Backend.get<Series>(`series/${id}`)
      .then(response => (this.series = response))
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }

  getFileUrl(fileName: string): string {
    return Backend.media(fileName);
  }
}
</script>

<style scoped>
.series-page {
  color: white;
  height: 100%;
  width: 100%;
}

.series-page-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.series-page-cover {
  background-position: center; /* Center the image */
  background-size: cover;
  flex-grow: 1;
  width: 100%;
}

.series-page-info {
  box-sizing: border-box;
  color: white;
  font-size: 24px;
  max-width: 100%;
  padding: 50px;
  width: 600px;
}

@media all and (max-width: 850px) {
  .series-page-info {
    font-size: 20px;
    padding: 30px;
  }
}

.series-page-body .empty-placeholder {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 120px;
}
</style>
