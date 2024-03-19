import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { LayoutModule } from '@app/_shared/components/layout/layout.module';

const materialModules = [
  MatProgressSpinnerModule
];

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, LayoutModule, ...materialModules],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  weatherData: any = {
    "cloudBase": null,
    "cloudCeiling": null,
    "cloudCover": 0,
    "dewPoint": -0.88,
    "freezingRainIntensity": 0,
    "humidity": 38,
    "precipitationProbability": 0,
    "pressureSurfaceLevel": 780.68,
    "rainIntensity": 0,
    "sleetIntensity": 0,
    "snowIntensity": 0,
    "temperature": 13.38,
    "temperatureApparent": 13.38,
    "uvHealthConcern": 0,
    "uvIndex": 0,
    "visibility": 16,
    "weatherCode": 8000,
    "windDirection": 94.38,
    "windGust": 1.31,
    "windSpeed": 0.81
  };

  statusSystem: boolean = true;

  showLoader: boolean = true;
  assetId: string | null = '';
  assetData: any = {};

  weatherCode: { [key: number]: { text: string, icon: string, background: string } } = {
    1000: {
      text: "Soleado",
      icon: "fa-regular fa-sun",
      background: "yellow"
    },
    1100: {
      text: "Mayormente soleado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1101: {
      text: "Parcialmente nublado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1102: {
      text: "Mayormente nublado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1001: {
      text: "Nublado",
      icon: "fa-solid fa-cloud",
      background: "yellow"
    },
    2000: {
      text: "Niebla",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    2100: {
      text: "Niebla ligera",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    4000: {
      text: "Llovizna",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4001: {
      text: "Lluvia",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    4200: {
      text: "Lluvia ligera",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4201: {
      text: "Fuertes lluvias",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    5000: {
      text: "Nieve",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5001: {
      text: "Nieve intensa",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5100: {
      text: "Nieve ligera",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5101: {
      text: "Nieve intensa",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    6000: {
      text: "Llovizna helada",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6001: {
      text: "Lluvia helada",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    6200: {
      text: "Lluvia ligera y helada",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6201: {
      text: "Fuerte lluvia helada",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    7000: {
      text: "Pellets de hielo",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7101: {
      text: "Películas de hielo pesadas",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7102: {
      text: "Películas de hielo ligeras",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    8000: {
      text: "Tormenta",
      icon: "fa-solid fa-cloud-bolt",
      background: "yellow"
    }
  }
 
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.assetId = params.get('assetId');
      this.getDetailsAsset();
    });
  }

  getDetailsAsset() {
    this.showLoader = false;
  }

  getWeather(lat: number, long: number){
    
  }
}
