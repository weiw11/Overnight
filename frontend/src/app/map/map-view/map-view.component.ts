import { Component, AfterViewInit, OnDestroy, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { LocationModel } from '../api/locations.model';
import { LocationAPIService } from '../api/location-api.service';
import { Subscription } from 'rxjs';
import { NominatimModel } from '../api/nominatim-results';

const iconFreeRetinaUrl = './assets/marker-icon-2x.png';
const iconFreeUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';

const iconFree = L.icon({
  iconRetinaUrl: iconFreeRetinaUrl,
  iconUrl: iconFreeUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
  });
const iconPaid = L.icon({
  iconRetinaUrl: './assets/marker-icon-green.png',
  iconUrl: './assets/marker-icon-green.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
  });
const iconPermit = L.icon({
  iconRetinaUrl: './assets/marker-icon-orange.png',
  iconUrl: './assets/marker-icon-orange.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
  });

L.Marker.prototype.options.icon = iconFree;

const googleUrl = 'https://www.google.com/maps/place/';
const OPACITY_UNFOCUS = .60;
const OPACITY_FOCUS = 1;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})

// TODO: Refactor this when done, really messy.
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  map: L.Map | undefined;
  locations: LocationModel[] = [];
  markers: L.Marker[] = [];
  coordCenter: L.LatLng | undefined;
  zoom: number | undefined;
  coordBounds: L.LatLngBounds | undefined;
  apiSub: Subscription | undefined;
  @Input() nominatim?: NominatimModel;

  constructor(private api: LocationAPIService) { }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.apiSub = this.api.getLocations().subscribe(data => {
      this.locations = data;
    },
    error => {
      console.log(`Unable to access API server: ${error}`);
    },
    () => {
      this.createMarkers();
    });

    this.getGeolocation().then(coords => {
      console.log(`Retrived Geo Coords: [${coords.coords.latitude}, ${coords.coords.longitude}]`);
      console.log(this.map?.getCenter());
      this.map?.flyTo([coords.coords.latitude, coords.coords.longitude], 10);
    }, () => {
      console.log('Geo permissions denied');
    });
  }

  ngAfterViewInit(): void {
    this.renderMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.nominatim = changes.nominatim.currentValue;
    this.map?.flyTo([Number(this.nominatim?.lat), Number(this.nominatim?.lon)], 10);
  }

  ngOnDestroy(): void {
    this.apiSub?.unsubscribe();
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  // Map functions
  getGeolocation(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(Error('No support for geolocation'));
        return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      });
    });
  }

  renderMap(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    const dark = L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    );
    const original = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    );
    const satelite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );

    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 4,
      attributionControl: false,
      layers: [satelite, dark, original],
    });

    const baseMaps = {
      Satelite: satelite,
      Dark: dark,
      Original: original,
    };

    L.control.layers(baseMaps).addTo(this.map);
    this.getMapAnalytics();
    this.createMapEvents();
  }

  getMapAnalytics(): void {
    this.coordCenter = this.map?.getCenter();
    this.zoom = this.map?.getZoom();
    this.coordBounds = this.map?.getBounds();
  }

  createMapEvents(): void {
    this.map?.on('moveend', () => {
      this.getMapAnalytics();
      console.log(`Coord: ${this.coordCenter} | Zoom: ${this.zoom} | Bounds: ${JSON.stringify(this.coordBounds)}`);
      this.toggleMarkers();
    });
  }

  toggleMarkers(): void {
    if (this.map !== undefined && this.coordBounds !== undefined && this.zoom !== undefined && this.markers.length > 0) {
      if (this.zoom > 7) {
        this.markers.forEach(marker => {
          if (this.isPointInsideBounds(marker.getLatLng(), this.coordBounds as L.LatLngBounds)) {
            marker.addTo(this.map as L.Map);
          } else {
            marker.removeFrom(this.map as L.Map);
          }
        });
      }
      if (this.zoom < 8) {
        this.markers.forEach(marker => {
          marker.removeFrom(this.map as L.Map);
        });
      }
    }
  }

  isPointInsideBounds(coord: L.LatLng, bounds: L.LatLngBounds): boolean {
    const x = coord.lat;
    const y = coord.lng;
    const x1 = bounds.getSouthWest().lat;
    const y1 = bounds.getSouthWest().lng;
    const x2 = bounds.getNorthEast().lat;
    const y2 = bounds.getNorthEast().lng;
    return (x > x1 && x < x2) && (y > y1 && y < y2);
  }

  createMarkers(): void {
    this.locations.forEach((location) => {
      if (this.map !== undefined) {
        const marker = L.marker([Number(location.latitude), Number(location.longitude)], {
          opacity: OPACITY_UNFOCUS,
          autoPan: false
        });

        switch (location.type_specific.fee) {
          case 'Pay':
            marker.setIcon(iconPaid);
            break;
          case 'Pass/Permit Required':
            marker.setIcon(iconPermit);
            break;
        }

        marker
        .on(('popupopen'), (e) => {
          marker.setOpacity(OPACITY_FOCUS);
        })
        .on('popupclose', (e) => {
          marker.setOpacity(OPACITY_UNFOCUS);
        });

        const popup = L.popup({
          autoPan: false
        })
        .setContent(`
          <b>${location.name}</b><br>
          <address>${location.city}, ${location.region}</address>
          Fee: ${location.type_specific.fee}<br>
          Link: <a href="${googleUrl}${location.latitude},${location.longitude}" target="_blank">Google</a>
        `);
        marker.bindPopup(popup);
        this.markers.push(marker);
      }
    });
  }

  checkMarkerPopup(marker: L.Marker): void {
    if (marker.isPopupOpen()) {
      marker.setOpacity(OPACITY_FOCUS);
    } else {
      marker.setOpacity(OPACITY_UNFOCUS);
    }
  }

}
