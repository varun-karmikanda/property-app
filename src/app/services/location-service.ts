import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HousingLocationInfo } from '../models/housing-location-info';
import { catchError, delay, filter, map, Observable, of, tap, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';

export const BASE_URL = new InjectionToken<string>('base url', {
  providedIn: 'root',
  factory: () => 'https://angular.dev/assets/images/tutorials/common',
});

interface LocationAppConfig {
  env: "DEV" | "PROD",
  os: "win" | "mac"    
}

export const LOCATION_APP_CONFIG = new InjectionToken<LocationAppConfig>("App configuration", {
  factory: () => ({ env: "DEV", os: "win"})
  }
)

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  static numberOfInstances = 0;
  private deletedIds = signal<number[]>([]);

  constructor() {
    LocationService.numberOfInstances += 1;
    console.log('Number of instances of ', LocationService.numberOfInstances);
  }

  private readonly baseUrl = inject(BASE_URL);

  private readonly housingLocationList: HousingLocationInfo[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      photo: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      wifi: true,
      laundry: true,
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      photo: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      wifi: true,
      laundry: true,
    },
  ];

  private location = signal<HousingLocationInfo[]>(this.housingLocationList);

  getAllLocation() {
    return this.location.asReadonly();
  }

  getLocationForId(id: number): HousingLocationInfo | undefined {
    return this.location().find((location) => location.id === id);
  }

  deleteItems(ids: number[]) {
    this.deletedIds.update(currentIds => [...currentIds, ...ids])
  }

  restoreItems() {
    this.deletedIds.set([]);
  }

  isDeleted(id: number) {
    return this.deletedIds().includes(id)
  }

  getDeletedIds() {
    return this.deletedIds()
  }

  addLocation(location: HousingLocationInfo) {
  //   const currentLocations = this.location();
  //   location.id = currentLocations.length;
  //   console.log(this.location())
    // currentLocations.push(location);
  //   this.location.set([...this.location(), ...currentLocations])
    
  //   this.location.set(currentLocations);
  //   console.log(this.location())

    console.log(location)
    const newLocation = { ...location, id: this.getTotalLocations() };
    console.log(newLocation)

    // this.location.set([...this.location(), newLocation])

    this.location.update(prev => [...prev, newLocation])
  
  }

  getTotalLocations() {
    return this.location().length
  }

  updateLocation(updatedLocation: HousingLocationInfo) {
    this.location.update(prevLocation => prevLocation.map(location => location.id === updatedLocation.id ? updatedLocation : location));
  }

  search(term: string): Observable<HousingLocationInfo[]> {
    const normalizedTerm = term.trim().toLowerCase();

    const filtered = this.location().filter((location) => {
      const searchableText = [location.name, location.city, location.state]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedTerm);
    });

    return of(filtered).pipe(delay(400));
  }

  // private locationJson$ = ajax({
  //   url: 'public/location.json',
  // }).pipe(
  //   map(httpResponse => httpResponse.response as HousingLocationInfo[]),
  //   delay(500),
  //   catchError(() => {
  //     const newError = new Error("the url is invalid, no resource is found");
  //     return throwError(() => newError)
  //   })
  // );

  // searchLocation(query: string): Observable<HousingLocationInfo[]> {
  //   const normalizedTerm = query.trim().toLowerCase();
  //   return this.locationJson$
  //     .pipe(
  //       map((locations) => locations.filter((location) => {
  //         const searchableText = [location.name, location.city, location.state]
  //         .join(' ')
  //         .toLowerCase();

  //         return searchableText.includes(normalizedTerm);
  //       })),
  //    )
  // }

}
