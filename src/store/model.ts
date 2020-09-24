import { Vue } from 'vue-property-decorator';
import { KeycloakInstance } from '@dsb-norge/vue-keycloak-js/node_modules/keycloak-js';
import { KeyValue } from 'jackknife';

export interface Environment {
  apiUrl: string;
  gravatarUrl: string;
  keycloak: KeyValue<string>;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  videos: Video[];
  username: string;
  series: Series[];
}

export interface Visit {
  id: number;
  date: string;
  video: string;
  completed?: boolean;
}

export class Video {
  id: number;
  title: string;
  description: string;
  bannerName: string;
  fileName: string;
  published: boolean;
  author: User;
  categories: Category[];
  series: string;
  visitsCount: number;
  averageRating: number;
  userRating: Rating;
  userVisit: Visit;
  createdAt: string;
}

export class Series {
  id: number;
  title: string;
  description: string;
  bannerName: string;
  videos: Video[] = [];
  categories: Category[] = [];
  createdAt: string;
}

export class LibraryForm {
  title = '';
  description = '';
  categories: string[] = [];
  bannerFile?: File;
  videoFile?: File;
  series?: number;
  published?: boolean;
}

export interface Category {
  id: number;
  description: string;
  videos: Video[];
  series: Series[];
}

export interface Rating {
  id: number;
  rating: string;
  date: string;
  comment: string;
  ruser: User;
  video: Video;
}

export interface Section {
  title: string;
  items: (Video | Series)[];
}

export interface HomeResponse {
  latestVideos: Video[];
  latestSeries: Series[];
  mostViewedVideos: Video[];
  mostViewedSeries: Series[];
  topRatedVideos: Video[];
  topRatedSeries: Series[];
}

export interface LibraryResponse {
  videos: Video[];
  series: Series[];
}

export interface SearchResponse {
  videos: Video[];
  series: Series[];
  categories: Category[];
}

export interface AuthorResponse {
  videos: Video[];
  series: Series[];
  categories: Category[];
}

export interface CategoryPageResponse {
  items: Category[];
  totalPages: number;
}

export interface VueKeycloakInstance extends KeycloakInstance {
  userName: string;
  fullName: string;
}

export class VueKeycloak extends Vue {
  $keycloak: VueKeycloakInstance;
}
