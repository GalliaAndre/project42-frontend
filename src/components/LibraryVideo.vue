<template>
  <div class="library-video" :class="{ published: model.published }">
    <img
      :src="getFileUrl(model.bannerName)"
      class="library-video-img"
      @click="$router.push(routerLink).catch(() => null)"
    />

    <h3 class="library-video-title">{{ model.title }}</h3>

    <div class="library-video-description">{{ model.description }}</div>

    <v-rating dense readonly v-model="model.averageRating"></v-rating>

    <div class="library-video-info">
      <div class="library-video-date">{{ date }}</div>

      <div class="library-video-categories">
        Categories: {{ categoryNames }}
      </div>

      <div class="library-video-visits">Views: {{ model.visitsCount }}</div>
    </div>

    <div class="library-video-toolbar">
      <LibraryVideoEdit
        buttonLabel="Edit"
        @reload="$emit('reload')"
        :model="model"
        :librarySeries="librarySeries"
        :categoryDescriptions="categoryDescriptions"
      />

      <LibraryVideoDelete @reload="$emit('reload')" :model="model" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Video, Series } from '@/store/model';
import LibraryVideoEdit from '@/components/LibraryVideoEdit.vue';
import LibraryVideoDelete from '@/components/LibraryVideoDelete.vue';
import Backend from '@/backend';

@Component({
  components: {
    LibraryVideoEdit,
    LibraryVideoDelete
  }
})
export default class LibraryVideo extends Vue {
  // Input
  @Prop() readonly model: Video;
  @Prop() readonly categoryDescriptions: string[];
  @Prop() readonly librarySeries: Series[];

  // Computed
  get categoryNames(): string {
    return this.model.categories.map(c => c.description).join(', ');
  }

  get date(): string {
    return new Date(this.model.createdAt).toLocaleString();
  }

  get routerLink(): string {
    return `/video/${this.model.id}`;
  }

  // Methods
  getFileUrl(fileName: string): string {
    return Backend.media(fileName);
  }
}
</script>

<style scoped>
.library-video {
  opacity: 0.5;
  overflow: hidden;
  width: 100%;
}

.library-video.published {
  opacity: 1;
}

.library-video-img {
  cursor: pointer;
  margin-bottom: 7px;
  width: 100%;
}

.library-video-info {
  font-size: 14px;
  margin: 10px 0;
}

.library-video-toolbar {
  display: flex;
  justify-content: space-between;
}
</style>
