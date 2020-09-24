<template>
  <v-dialog v-model="showDialog" persistent width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark small color="primary" v-bind="attrs" v-on="on">
        {{ model ? 'Edit' : 'New' }} Series
        <v-icon>mdi-{{ model ? 'pencil-outline' : 'plus' }}</v-icon>
      </v-btn>
    </template>

    <v-form v-model="isValid" @submit.prevent="submit()">
      <v-card>
        <v-card-title>Series</v-card-title>

        <v-card-text class="dialog-overflow">
          <v-text-field
            v-model="form.title"
            label="Title *"
            :rules="[requiredRule]"
          ></v-text-field>

          <v-file-input
            v-model="form.bannerFile"
            :rules="bannerFileRules"
            :label="'New file banner ' + (model ? '' : '*')"
            hint="Formats .jpg, .png"
            accept="image/jpeg, image/png"
            persistent-hint
            show-size
          ></v-file-input>

          <v-combobox
            v-model="form.categories"
            :rules="categoriesRules"
            :items="categoryDescriptions"
            label="Categories *"
            multiple
            chips
            :deletable-chips="true"
          ></v-combobox>

          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="[requiredRule]"
          ></v-textarea>

          <small>* required fields</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-alert type="error" dense text v-if="hasError">
            An error occurred.
          </v-alert>

          <v-spacer></v-spacer>

          <v-btn @click="showDialog = false" v-if="!isLoading">Cancel</v-btn>

          <v-btn
            color="primary"
            :disabled="!isValid || isLoading"
            type="submit"
            v-if="!isLoading"
          >
            Save
          </v-btn>

          <Spinner v-if="isLoading" color="primary" :block="false" :size="30" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { LibraryForm, Series } from '@/store/model';
import Backend from '@/backend';
import { objectToFormData } from 'object-to-formdata';

@Component
export default class LibrarySeriesEdit extends Vue {
  // Input
  @Prop() readonly categoryDescriptions: string[];
  @Prop() readonly model?: Series;

  // Data
  form = new LibraryForm();
  showDialog = false;
  isLoading = false;
  hasError = false;
  isValid = false;
  bannerFileRules = [
    (value: File) =>
      (value && value.size < 2000000) ||
      this.model !== undefined ||
      'Max file size: 2 MB'
  ];
  categoriesRules = [(value: number[]) => value.length > 0 || 'Required field'];
  requiredRule = (value: string) => value.length > 0 || 'Required field';

  // Watchers
  @Watch('showDialog')
  onToggleDialog(showDialog: boolean): void {
    if (!showDialog) {
      return;
    }

    if (this.model) {
      this.form = {
        title: this.model.title,
        description: this.model.description,
        categories: this.model.categories.map(c => c.description)
      };
    } else {
      this.form = new LibraryForm();
    }
  }

  // Methods
  submit(): void {
    this.isLoading = true;
    this.hasError = false;

    const url = this.model ? `series/${this.model.id}` : 'series';
    const formData = objectToFormData(this.form, {
      indices: true,
      nullsAsUndefineds: true
    });

    Backend.multipart<void>('post', url, formData)
      .then(() => {
        this.showDialog = false;
        this.$emit('reload');
      })
      .catch(() => (this.hasError = true))
      .then(() => (this.isLoading = false));
  }
}
</script>
