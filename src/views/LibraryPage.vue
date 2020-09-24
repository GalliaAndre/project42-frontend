<template>
  <div class="library-page">
    <h1 class="library-page-header">Library</h1>

    <Spinner v-if="isLoading" />

    <ErrorPlaceholder @reload="load()" v-if="hasError" />

    <div class="library-page-body" v-if="!isLoading && !hasError">
      <h2 class="library-page-title">
        List of series
        <LibrarySeriesEdit
          :categoryDescriptions="categoryDescriptions"
          @reload="load()"
        />
      </h2>

      <div
        class="library-page-section"
        v-for="series in librarySeries"
        :key="series.id"
      >
        <h3
          class="library-page-section-title"
          :style="{
            backgroundImage: 'url(' + getFileUrl(series.bannerName) + ')'
          }"
        >
          {{ series.title }}
          <section>
            <LibrarySeriesEdit
              :categoryDescriptions="categoryDescriptions"
              @reload="load()"
              :model="series"
            />
            <LibrarySeriesDelete @reload="load()" :model="series" />
          </section>
        </h3>

        <div class="library-page-section-body">
          <LibraryVideo
            v-for="video in series.videos"
            :model="video"
            :librarySeries="librarySeries"
            :categoryDescriptions="categoryDescriptions"
            :key="video.id"
            @reload="load()"
          />

          <LibraryVideoEdit
            buttonLabel="Add new episode"
            :bigButton="true"
            :defaultSeries="series.id"
            :librarySeries="librarySeries"
            :categoryDescriptions="categoryDescriptions"
            @reload="load()"
          />
        </div>
      </div>

      <EmptyPlaceholder v-if="!librarySeries.length" />

      <h2 class="library-page-title">List of videos</h2>

      <div class="library-page-section">
        <div class="library-page-section-body">
          <LibraryVideo
            v-for="video in libraryVideos"
            :model="video"
            :key="video.id"
            :librarySeries="librarySeries"
            :categoryDescriptions="categoryDescriptions"
            @reload="load()"
          />

          <LibraryVideoEdit
            buttonLabel="Add new video"
            :bigButton="true"
            :librarySeries="librarySeries"
            :categoryDescriptions="categoryDescriptions"
            @reload="load()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import LibraryVideo from '@/components/LibraryVideo.vue';
import LibraryVideoEdit from '@/components/LibraryVideoEdit.vue';
import LibrarySeriesEdit from '@/components/LibrarySeriesEdit.vue';
import LibrarySeriesDelete from '@/components/LibrarySeriesDelete.vue';
import { Video, Series, VueKeycloak, LibraryResponse } from '@/store/model';
import Backend from '@/backend';

@Component({
  components: {
    LibraryVideo,
    LibraryVideoEdit,
    LibrarySeriesEdit,
    LibrarySeriesDelete
  }
})
export default class LibraryPage extends VueKeycloak {
  // Data
  libraryVideos: Video[];
  librarySeries: Series[];
  categoryDescriptions: string[];
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

    this.loadLibrary()
      .then(() => this.loadCategories())
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }

  async loadLibrary(): Promise<void> {
    return Backend.get<LibraryResponse>('library').then(response => {
      this.libraryVideos = response.videos;
      this.librarySeries = response.series;
    });
  }

  async loadCategories(): Promise<void> {
    return Backend.get<string[]>('categories/descriptions').then(response => {
      this.categoryDescriptions = response;
    });
  }

  getFileUrl(fileName: string): string {
    return Backend.media(fileName);
  }
}
</script>

<style scoped>
.library-page {
  color: white;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.library-page-header {
  font-size: 38px;
  font-weight: normal;
  padding: 25px 25px 0 25px;
}

.library-page-body {
  padding: 25px;
}

.library-page-body .empty-placeholder {
  margin-bottom: 40px;
}

.library-page-title {
  display: flex;
  font-size: 30px;
  font-weight: normal;
  justify-content: space-between;
  margin-bottom: 25px;
}

.library-page-section {
  margin-bottom: 70px;
}

.library-page-section-title {
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  min-height: 200px;
  padding: 20px;
}

.library-page-section-body {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr;
}

@media all and (min-width: 600px) {
  .library-page-section-body {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media all and (min-width: 900px) {
  .library-page-section-body {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media all and (min-width: 1200px) {
  .library-page-section-body {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media all and (min-width: 1500px) {
  .library-page-section-body {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
