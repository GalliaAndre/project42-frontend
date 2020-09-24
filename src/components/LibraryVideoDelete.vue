<template>
  <v-dialog v-model="showDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark small color="error" v-bind="attrs" v-on="on">
        Delete
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Confirm</v-card-title>

      <v-card-text>
        Do you confirm the deletion of "{{ model.title }}"?
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-alert type="error" dense text v-if="hasError">
          An error occurred.
        </v-alert>

        <v-spacer></v-spacer>

        <v-btn @click="showDialog = false" v-if="!isLoading">Cancel</v-btn>

        <v-btn color="error" @click="submit()" v-if="!isLoading">
          Delete
        </v-btn>

        <Spinner v-if="isLoading" color="primary" :block="false" :size="30" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Video } from '@/store/model';
import Backend from '@/backend';

@Component
export default class LibraryVideoDelete extends Vue {
  // Input
  @Prop() readonly model: Video;

  // Data
  showDialog = false;
  isLoading = false;
  hasError = false;

  // Methods
  submit(): void {
    this.isLoading = true;
    this.hasError = false;

    Backend.delete<void>(`videos/${this.model.id}`)
      .then(() => {
        this.showDialog = false;
        this.$emit('reload');
      })
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }
}
</script>
