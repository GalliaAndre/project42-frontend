<template>
  <div class="author-page">
    <Spinner v-if="isLoading" />

    <ErrorPlaceholder @reload="load()" v-if="hasError" />

    <template v-if="!isLoading && !hasError">
      <div class="author-page-board">
        <h1 class="author-page-header">
          <v-btn icon dark @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          {{ author.firstName }} {{ author.lastName }}

          <div class="author-page-email">
            <v-icon dark>mdi-email</v-icon>
            {{ author.email }}
          </div>
        </h1>

        <img :src="avatar" v-if="avatar" class="author-page-avatar" />
      </div>

      <SectionList :sections="sections" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Section, User } from '@/store/model';
import Backend from '@/backend';
import { VueKeycloak } from '@/store/model';

@Component
export default class AuthorPage extends VueKeycloak {
  sections: Section[] = [];
  isLoading = false;
  hasError = false;
  author: User;
  avatar = '';

  // Hooks
  created(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    const id = this.$route.params.id;

    Backend.get<User>(`users/${id}`)
      .then(response => {
        this.author = response;
        this.avatar = Backend.avatar(this.author.email);
        const fullName = `${this.author.firstName} ${this.author.lastName}`;

        this.sections = [
          {
            title: `Videos published by ${fullName} (${this.author.videos.length})`,
            items: this.author.videos
          },
          {
            title: ` Series published by ${fullName} (${this.author.series.length})`,
            items: this.author.series
          }
        ];
      })
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }
}
</script>

<style scoped>
.author-page {
  color: white;
  height: 100%;
  overflow: auto;
  width: 100%;
}

.author-page-header {
  font-size: 38px;
  font-weight: normal;
  padding: 25px 25px 0 25px;
}

.author-page-board {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.author-page-email {
  font-size: 16px;
  margin-top: 10px;
}

.author-page-avatar {
  border-radius: 5px;
  margin: 25px;
  width: 200px;
}

@media all and (max-width: 800px) {
  .author-page-board {
    flex-direction: column;
  }
}
</style>
