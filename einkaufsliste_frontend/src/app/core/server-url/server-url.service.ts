import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {

  readonly APIUrl = this.providedUrl;

  constructor(@Inject('BACKEND_URL') private providedUrl: string) { }

  getAPIUrl(): string {
    return this.APIUrl;
  }
}