import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NominatimModel } from './nominatim-results';

@Injectable({
  providedIn: 'root'
})
export class NominatimApiService {

  private url = 'https://nominatim.openstreetmap.org/search?format=json';

  constructor(private http: HttpClient) { }

  getResults(place: string): Observable<NominatimModel[]> {
    console.log(`URL: ${this.url + place}`);
    return this.http.get<NominatimModel[]>(`${this.url}&q=${place}`);
  }
}
