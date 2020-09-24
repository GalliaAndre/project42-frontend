<template>
  <div
    class="carousel-item"
    @click="$router.push(routerLink).catch(() => null)"
    :style="{
      backgroundImage: 'url(' + getFileUrl(model.bannerName) + ')'
    }"
  >
    <div class="carousel-item-title">{{ model.title }}</div>

    <v-icon class="carousel-item-check" color="green" v-if="model.userVisit">
      mdi-check
    </v-icon>

    <v-rating
      class="carousel-item-rating"
      dense
      readonly
      v-model="model.averageRating"
      v-if="model.averageRating"
    ></v-rating>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Video, Series } from '@/store/model';
import Backend from '@/backend';

@Component
export default class CarouselItem extends Vue {
  // Input
  @Prop() readonly model: Series | Video;

  // Computed
  get routerLink(): string {
    const prefix = 'videos' in this.model ? 'series' : 'video';
    return `/${prefix}/${this.model.id}`;
  }

  // Methods
  getFileUrl(fileName: string): string {
    return Backend.media(fileName);
  }
}
</script>

<style scoped>
.carousel-item {
  background-position: center;
  background-size: cover;
  cursor: pointer;
  display: flex;
  height: 150px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.carousel-item-title {
  background-color: #0009;
  bottom: 0;
  box-sizing: border-box;
  color: white;
  left: 0;
  padding: 5px 10px;
  position: absolute;
  width: 100%;
}

.carousel-item-rating {
  position: absolute;
  right: 5px;
  top: 5px;
}

.carousel-item-check {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 7px;
  left: 7px;
  position: absolute;
  top: 7px;
}
</style>
