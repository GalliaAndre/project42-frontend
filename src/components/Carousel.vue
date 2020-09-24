<template>
  <div class="carousel">
    <swiper :options="swiperOptions">
      <swiper-slide v-for="item in items" :key="item.id">
        <CarouselItem :model="item" />
      </swiper-slide>

      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CarouselItem from './CarouselItem.vue';
import { Series, Video } from '@/store/model';
import { SwiperOptions } from 'swiper';

@Component({
  components: {
    CarouselItem
  }
})
export default class Carousel extends Vue {
  // Input
  @Prop() readonly items: (Video | Series)[];

  // Data
  swiperOptions: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      550: {
        slidesPerView: 2
      },
      750: {
        slidesPerView: 3
      },
      950: {
        slidesPerView: 4
      },
      1150: {
        slidesPerView: 5
      },
      1350: {
        slidesPerView: 6
      },
      1550: {
        slidesPerView: 7
      }
    }
  };
}
</script>

<style scoped>
.carousel {
  width: 100%;
}

.swiper-button-prev,
.swiper-button-next {
  color: #ddd;
  pointer-events: initial;
  width: 60px;
}

.swiper-button-prev {
  left: 0;
}

.swiper-button-next {
  right: 0;
}
</style>
