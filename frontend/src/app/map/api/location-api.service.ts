import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationModel } from './locations.model';
import { apiURL } from '../../.env';

@Injectable({
  providedIn: 'root'
})
export class LocationAPIService {

  constructor(private http: HttpClient) { }

  getLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(apiURL);
  }

}
