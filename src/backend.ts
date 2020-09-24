import axios from 'axios';
import { KeyValue } from 'jackknife';
import md5 from 'md5';
import Vue from 'vue';

export default class Backend {
  static apiUrl(): string {
    return `${Vue.prototype.$env.apiUrl}/api`;
  }

  static async get<R>(
    path: string,
    params?: KeyValue<string | number | null>
  ): Promise<R> {
    return axios
      .get<R>(`${this.apiUrl()}/${path}`, {
        params,
        headers: this.getHeaders()
      })
      .then(response => response.data);
  }

  static async post<R, D>(path: string, data: D): Promise<R> {
    return axios
      .post<R>(`${this.apiUrl()}/${path}`, data, { headers: this.getHeaders() })
      .then(response => response.data);
  }

  static async put<R, D>(path: string, data: D): Promise<R> {
    return axios
      .put<R>(`${this.apiUrl()}/${path}`, data, { headers: this.getHeaders() })
      .then(response => response.data);
  }

  static async patch<R, D>(path: string, data: D): Promise<R> {
    return axios
      .patch<R>(`${this.apiUrl()}/${path}`, data, {
        headers: this.getHeaders()
      })
      .then(response => response.data);
  }

  static async delete<R>(path: string): Promise<R> {
    return axios
      .delete<R>(`${this.apiUrl()}/${path}`, { headers: this.getHeaders() })
      .then(response => response.data);
  }

  static async multipart<R>(
    method: 'post' | 'put' | 'patch',
    path: string,
    data: FormData
  ): Promise<R> {
    return axios[method]<R>(`${this.apiUrl()}/${path}`, data, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  }

  static avatar(email: string): string {
    return `${Vue.prototype.$env.gravatarUrl}/${md5(email)}?s=200`;
  }

  static media(fileName: string): string {
    return `${Vue.prototype.$env.apiUrl}/media/files/${fileName}`;
  }

  private static getHeaders(): KeyValue<string> {
    return {
      Authorization: `Bearer ${Vue.prototype.$keycloak.token}`
    };
  }
}
