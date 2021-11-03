import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NominatimApiService } from '../api/nominatim-api.service';
import { NominatimModel } from '../api/nominatim-results';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit, OnDestroy {

  formGroup: ReactiveFormsModule| undefined;
  search: FormGroup;
  result: NominatimModel | undefined;
  nomSub: Subscription | undefined;

  constructor(private fb: FormBuilder, private nominatimService: NominatimApiService) {
    this.search = fb.group({
      searchText: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.nomSub?.unsubscribe();
  }

  submitForm(): void {
    console.log('Search result: ', this.search.value.searchText);
    this.nomSub = this.nominatimService.getResults(this.search.value.searchText).subscribe(data => {
      console.log(`Data: ${data}`);

      this.result = data[0];
      console.log('City: ' + data[0].display_name);
    });
  }

}
