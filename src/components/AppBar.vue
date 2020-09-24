<template lang="html">
  <div class="app-bar">
    <section>
      <img
        src="../assets/logo.png"
        class="app-bar-logo"
        @click="$router.push('/').catch(() => null)"
      />
    </section>

    <v-text-field
      class="app-bar-search"
      dark
      placeholder="Search..."
      v-model="searchKey"
      :append-icon="searchIcon"
      @click:append="clearSearch()"
      @keyup.enter="goSearch()"
    ></v-text-field>

    <section>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar class="app-bar-avatar" v-on="on">
            <img :src="avatar" v-if="avatar" />
          </v-avatar>
        </template>

        <v-list class="app-bar-menu">
          <v-list-item @click="$router.push('/library').catch(() => null)">
            <v-icon>mdi-video-box</v-icon>
            <v-list-item-title> Your videos </v-list-item-title>
          </v-list-item>

          <v-list-item @click="$keycloak.logoutFn()">
            <v-icon>mdi-exit-to-app</v-icon>
            <v-list-item-title> Logout </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Backend from '@/backend';
import { VueKeycloak } from '@/store/model';

@Component
export default class AppBar extends VueKeycloak {
  // Data
  searchKey = '';
  avatar = '';

  // Computed
  get searchIcon(): string {
    return this.searchKey.length ? 'mdi-close' : 'mdi-magnify';
  }

  // Hooks
  created(): void {
    this.searchKey = this.$route.params.key || '';

    this.$keycloak.loadUserProfile().success(profile => {
      this.avatar = Backend.avatar(profile.email as string);
    });
  }

  // Methods
  goSearch(): void {
    if (this.searchKey.length > 2) {
      this.$router.push(`/search/${this.searchKey}`).catch(() => null);
    }
  }

  clearSearch(): void {
    if (this.searchKey.length) {
      this.searchKey = '';
      this.$router.push('/').catch(() => null);
    }
  }
}
</script>

<style scoped>
.app-bar {
  align-items: center;
  background-color: #f47730;
  box-sizing: border-box;
  color: white;
  display: flex;
  height: 60px;
  justify-content: space-between;
  left: 0;
  padding: 0px 15px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.app-bar-logo {
  cursor: pointer;
  display: block;
  height: 30px;
}

.app-bar-avatar {
  border: 5px solid white;
  cursor: pointer;
}

.app-bar-search {
  align-items: center;
  display: flex;
  max-width: calc(100% - 100px);
  position: fixed;
  right: 80px;
  width: 300px;
}

.app-bar-menu .v-icon {
  margin-right: 5px;
}

@media all and (max-width: 700px) {
  .app-bar-logo {
    display: none;
  }
}
</style>
