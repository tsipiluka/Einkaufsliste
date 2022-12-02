import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import pkg from '../../../../secrets.json';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ngbPositioning } from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css'],
})
export class GmapComponent implements OnInit {
  visibleSidebar: boolean = false;
  center: google.maps.LatLngLiteral = { lat: 51.678418, lng: 7.809007 };
  zoom = 4;
  display: any;
  GMAP_API_KEY: string = pkg.GOOGLE_MAPS_API_KEY;
  url = 'https://maps.googleapis.com/maps/api/js?key=' + this.GMAP_API_KEY;
  apiLoaded: Observable<boolean>;
  lat = this.watchPosition().lat;
  long = this.watchPosition().long;
  options: google.maps.MapOptions = {
    center: { lat: this.lat, lng: this.long },
  };
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private router: Router, private httpClient: HttpClient) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }

    this.apiLoaded = this.httpClient.jsonp(this.url, 'callback').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  ngOnInit(): void {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your device/browser');
    }
    navigator.geolocation.getCurrentPosition(position => {
      console.log('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude);
    });
    this.watchPosition();
  }

  watchPosition() {
    let desLat = 0;
    let desLong = 0;
    let lat = 0;
    let long = 0;
    let id = navigator.geolocation.watchPosition(
      position => {
        console.log('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude);
        if (position.coords.latitude === desLat && position.coords.longitude === desLong) {
          navigator.geolocation.clearWatch(id);
        }
        lat = position.coords.latitude;
        long = position.coords.longitude;
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
    return { lat: lat, long: long };
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng!.toJSON());
  }
}
