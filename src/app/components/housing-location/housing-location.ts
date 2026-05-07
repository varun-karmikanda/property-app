import { Component, inject, input, output, signal } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';
import { MockLocationService } from '../../services/mock-location.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CardLayout } from "../card-layout/card-layout";

@Component({
  selector: 'app-housing-location',
  imports: [RouterOutlet, CardLayout],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  providers: [{ provide: BASE_URL, useValue: "hehe hehe heee"}]
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  activatedRoute = inject(ActivatedRoute)
  onLocationClick = output<HousingLocationInfo>();
  isEditMode = input<boolean>(false);
  isSelected = input<boolean>(false);
  selectedLocation = output<{ id: number, selected: boolean}>();

  router = inject(Router);

  handleClick() {
    if(this.isEditMode()) {
      this.selectedLocation.emit({
        id: this.housingLocation().id,
        selected: !this.isSelected()
      });
    }
    this.onLocationClick.emit(this.housingLocation());
  }

  handleEdit() {
    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute,
      queryParams: { id: this.housingLocation().id }
    })
  }

  // ngOnInit(){
  //   console.log(this.housingLocation()) 
  // }
}
