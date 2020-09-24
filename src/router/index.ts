import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import SeriesPage from '@/views/SeriesPage.vue';
import LibraryPage from '@/views/LibraryPage.vue';
import SearchPage from '@/views/SearchPage.vue';
import VideoPage from '@/views/VideoPage.vue';
import AuthorPage from '@/views/AuthorPage.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/series/:id',
    name: 'SeriesPage',
    component: SeriesPage
  },
  {
    path: '/video/:id',
    name: 'VideoPage',
    component: VideoPage
  },
  {
    path: '/search/:key',
    name: 'SearchPage',
    component: SearchPage
  },
  {
    path: '/library',
    name: 'LibraryPage',
    component: LibraryPage
  },
  {
    path: '/author/:id',
    name: 'AuthorPage',
    component: AuthorPage
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
