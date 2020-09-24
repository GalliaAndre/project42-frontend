<template>
  <div class="video-page">
    <Spinner v-if="isLoading" />

    <ErrorPlaceholder @reload="load()" v-if="hasError" />

    <template v-if="!isLoading && !hasError">
      <div
        class="video-page-body"
        :style="{
          backgroundImage: 'url(' + getFileUrl(video.bannerName) + ')'
        }"
        v-if="!displayedVideo"
      >
        <div class="video-page-info">
          <h1 class="video-page-title">
            <v-btn icon dark @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ video.title }}
          </h1>

          <p>{{ video.description }}</p>

          <div class="video-page-sheet">
            <span
              v-if="video.author"
              @click="goAuthorPage()"
              class="video-page-author"
            >
              <v-icon dark>mdi-account</v-icon>
              {{ video.author.firstName }} {{ video.author.lastName }}
            </span>

            <span title="Data di creazione">
              <v-icon dark>mdi-calendar-month</v-icon>
              {{ date }}
            </span>

            <span title="Visualizzazioni">
              <v-icon dark>mdi-eye</v-icon>
              {{ video.visitsCount }}
            </span>
          </div>

          <v-menu :close-on-content-click="false" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <div class="video-page-rating" v-bind="attrs" v-on="on">
                <v-rating
                  v-model="video.averageRating"
                  readonly
                  color="white"
                  background-color="white"
                ></v-rating>
              </div>
            </template>

            <v-card>
              <v-rating :value="userRating" @input="onUserRating"></v-rating>
              <v-card-text>Your rating</v-card-text>
            </v-card>
          </v-menu>

          <div class="video-page-categories">
            <v-chip
              class="video-page-categories-item"
              v-for="category in video.categories"
              :key="category.id"
              >{{ category.description }}</v-chip
            >
          </div>

          <v-btn
            class="video-page-play"
            color="primary"
            dark
            x-large
            @click="displayedVideo = true"
          >
            <v-icon dark>mdi-play</v-icon>Play Video
          </v-btn>
        </div>
      </div>

      <div class="video-page-player" v-else>
        <video
          class="video-page-player-file"
          controls
          autoplay
          :src="getFileUrl(video.fileName)"
          @loadeddata="isPlayerLoading = false"
          @timeupdate="checkCompleted($event)"
        ></video>

        <v-btn
          class="video-page-player-close"
          icon
          dark
          @click="displayedVideo = false"
        >
          <v-icon dark large>mdi-close</v-icon>
        </v-btn>

        <Spinner :block="false" v-if="isPlayerLoading" />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Video, Visit } from '@/store/model';
import Backend from '@/backend';

@Component
export default class VideoPage extends Vue {
  // Data
  video = new Video();
  isLoading = false;
  hasError = false;
  displayedVideo = false;
  isPlayerLoading = true;
  todayDate = new Date();

  // Computed
  get date(): string {
    return new Date(this.video.createdAt).toLocaleString().split(',')[0];
  }

  get userRating(): number {
    return this.video.userRating ? Number(this.video.userRating.rating) : 0;
  }

  // Hooks
  created(): void {
    this.load();
  }

  goAuthorPage(): void {
    this.$router.push(`/author/${this.video.author.id}`).catch(() => null);
  }

  // Methods
  load(): void {
    this.isLoading = true;
    this.hasError = false;
    const id = this.$route.params.id;

    Backend.get<Video>(`videos/${id}`)
      .then(response => {
        this.video = response;
        this.trackVisit();
      })
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }

  trackVisit(): void {
    if (this.video.userVisit) {
      return;
    }

    const visit: Partial<Visit> = {
      date: this.todayDate.toISOString(),
      video: `api/videos/${this.video.id}`,
      completed: false
    };

    Backend.post<Visit, Partial<Visit>>('visits', visit).then(
      response => (this.video.userVisit = response)
    );
  }

  onUserRating(rating: number): void {
    Backend.post<void, { rating: number }>(`videos/${this.video.id}/rating`, {
      rating
    });
  }

  checkCompleted(event: Event): void {
    const target = event.target as HTMLVideoElement;
    const percentage = (target.currentTime / target.duration) * 100;

    if (
      percentage > 80 &&
      this.video.userVisit &&
      !this.video.userVisit.completed
    ) {
      this.video.userVisit.completed = true;

      Backend.patch(`visits/${this.video.userVisit.id}`, {
        completed: true
      }).catch(() => (this.video.userVisit.completed = false));
    }
  }

  getFileUrl(fileName: string): string {
    return Backend.media(fileName);
  }
}
</script>

<style scoped>
.video-page {
  color: white;
  height: 100%;
  width: 100%;
}

.video-page-body {
  background-position: center;
  background-size: cover;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.video-page-info {
  box-sizing: border-box;
  color: white;
  font-size: 24px;
  max-width: 100%;
  padding: 50px;
  width: 600px;
}

@media all and (max-width: 850px) {
  .video-page-info {
    font-size: 20px;
    padding: 30px;
  }
}

.video-page-sheet {
  display: flex;
  font-size: 0.75em;
  justify-content: space-between;
}

@media all and (max-width: 400px) {
  .video-page-sheet {
    flex-direction: column;
  }
}

.video-page-rating {
  display: inline-block;
  margin-top: 20px;
}

.video-page-categories {
  margin-top: 20px;
}

.video-page-categories-item {
  margin-right: 15px;
}

.video-page-play.v-btn.v-size--x-large {
  display: block;
  font-size: 1.2em;
  height: auto;
  margin: 40px auto;
  max-width: 300px;
  padding: 15px;
  width: 100%;
}

.video-page-player {
  height: 100%;
  position: relative;
  width: 100%;
}

.video-page-player-file {
  height: 100%;
  width: 100%;
}

.video-page-player-close {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
}

.video-page-player .spinner {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.video-page-author {
  cursor: pointer;
}
</style>
