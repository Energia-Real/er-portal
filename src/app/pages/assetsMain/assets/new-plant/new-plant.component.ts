import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject, takeUntil } from 'rxjs';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';
import * as entityCatalogs from '../../../../shared/models/catalogs-models';
import * as entity from '../assets-model';
import { Loader } from '@googlemaps/js-api-loader';
import { HomeService } from '@app/pages/homeMain/home/home.service';

@Component({
  selector: 'app-new-plant',
  templateUrl: './new-plant.component.html',
  styleUrl: './new-plant.component.scss'
})
export class NewPlantComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  formData = this.fb.group({
    siteName: ['', Validators.required],
    plantCode: [''],
    direction: [''],
    link: [{ value: '', disabled: true }],
    contractTypeId: [''],
    latitude: [0],
    longitude: [0],
    installationTypeId: [''],
    performanceRatio: [''],
    yearlyYield: [''],
    qualityRatio: [''],
    nominalPowerAC: [''],
    commissionDate: [''],
    installedCapacity: [''],
    contractSignatureDate: [''],
    endInstallationDate: [''],
    systemSize: [''],
    rpu: [''],
    statusPlantId: [''],
    netZero: [''],
    searchAddress: [''],
  });

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  latitude: any;
  longitude: any;
  autocomplete!: google.maps.places.Autocomplete;

  catContractType: entityCatalogs.DataCatalogs[] = [];
  catInstallationType: entityCatalogs.DataCatalogs[] = [];
  catPlantStatus: entityCatalogs.DataCatalogs[] = [];
  objEditData!: entity.DataPlant;

  showLoader: boolean = false;
  loading: boolean = false;

  mapLink: string = ''
  dataClientsList: entity.DataRespSavingDetailsList[] = []

  constructor(
    private catalogsService: CatalogsService,
    private notificationService: OpenModalsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private moduleServices: AssetsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCatalogs();
    this.mapTo();
    this.getDataClientsList();
  }

  getId() {
    this.activatedRoute.params.pipe(takeUntil(this.onDestroy)).subscribe((params: any) => {
      if (params.id) this.getDataById(params.id);
    });
  }

  getDataById(id: string) {
    this.moduleServices.getDataId(id).subscribe({
      next: (response: entity.DataPlant | any) => {
        this.objEditData = response;
        this.formData.patchValue(response);
        this.getAddressMap(response);
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getCatalogs() {
    this.catalogsService.getCatPlantStatus().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catPlantStatus = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })

    this.catalogsService.getCatContractType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catContractType = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catInstallationType = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catInstallationType = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    });

    this.getId();
  }

  actionSave() {
    // const objData: any = { ...this.formData.value }
    const objData: any = {}

    if (this.formData.get('siteName')?.value) objData.siteName = this.formData.get('siteName')?.value;
    if (this.formData.get('plantCode')?.value) objData.plantCode = this.formData.get('plantCode')?.value;
    if (this.formData.get('direction')?.value) objData.direction = this.formData.get('direction')?.value;
    if (this.formData.get('link')?.value) objData.link = this.formData.get('link')?.value;
    if (this.formData.get('performanceRatio')?.value) objData.performanceRatio = this.formData.get('performanceRatio')?.value;
    if (this.formData.get('yearlyYield')?.value) objData.yearlyYield = this.formData.get('yearlyYield')?.value;
    if (this.formData.get('nominalPowerAC')?.value) objData.nominalPowerAC = this.formData.get('nominalPowerAC')?.value;
    if (this.formData.get('contractTypeId')?.value) objData.contractTypeId = this.formData.get('contractTypeId')?.value;
    if (this.formData.get('latitude')?.value) objData.latitude = this.formData.get('latitude')?.value;
    if (this.formData.get('longitude')?.value) objData.longitude = this.formData.get('longitude')?.value;
    if (this.formData.get('installationTypeId')?.value) objData.installationTypeId = this.formData.get('installationTypeId')?.value;
    if (this.formData.get('commissionDate')?.value) objData.commissionDate = this.formData.get('commissionDate')?.value;
    if (this.formData.get('installedCapacity')?.value) objData.installedCapacity = this.formData.get('installedCapacity')?.value;
    if (this.formData.get('systemSize')?.value) objData.systemSize = this.formData.get('systemSize')?.value;
    if (this.formData.get('rpu')?.value) objData.rpu = this.formData.get('rpu')?.value;
    if (this.formData.get('statusPlantId')?.value) objData.statusPlantId = this.formData.get('statusPlantId')?.value;
    if (this.formData.get('netZero')?.value) objData.netZero = this.formData.get('netZero')?.value;
    if (this.formData.get('commissionDate')?.value) objData.commissionDate = moment(this.formData.get('commissionDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('endInstallationDate')?.value) objData.endInstallationDate = moment(this.formData.get('endInstallationDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('contractSignatureDate')?.value) objData.contractSignatureDate = moment(this.formData.get('contractSignatureDate')?.value).format('YYYY-MM-DD');
    console.log('GUARDAR', objData);
    
    if (this.objEditData) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData: entity.DataPlant) {
    this.moduleServices.postDataPlant(objData).subscribe({
      next: () => { this.completionMessage() },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPlant) {
    this.moduleServices.patchDataPlant(this.objEditData.id, objData).subscribe({
      next: () => { this.completionMessage(true) },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getDataClientsList() {
    this.homeService.getDataClientsList().subscribe({
      next: (response: entity.DataRespSavingDetailsList[]) => {
        this.dataClientsList = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getAddressMap(response: entity.DataPlant | any) {
    const location = {
      lat: response.latitude,
      lng: response.longitude,
    };
    this.map?.setCenter(location);
    this.marker?.setPosition(location);
    this.map?.setZoom(15);


    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const address = results[0].formatted_address;
        this.formData.patchValue({
          searchAddress: address
        });
      }
    });
  }

  mapTo() {
    const loader = new Loader({
      apiKey: 'AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      this.initMap();
      this.initAutocomplete();
    }).catch(e => {
      console.error("Error loading Google Maps API", e);
    });
  }

  initMap() {
    const initialLocation = { lat: 23.6345, lng: -102.5528 };

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: initialLocation,
      zoom: 5,
    });

    this.marker = new google.maps.Marker({
      position: initialLocation,
      map: this.map,
      draggable: true
    });

    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      this.latitude = position?.lat();
      this.longitude = position?.lng();
      this.updateMapLink();
    });
  }

  searchLocation() {
    const place = this.autocomplete?.getPlace();

    if (place && place.geometry) {
      this.map.setCenter(place.geometry.location!);
      this.map.setZoom(15);
      this.marker.setPosition(place.geometry.location!);
      this.latitude = place.geometry.location!.lat();
      this.longitude = place.geometry.location!.lng();
    }
  }

  initAutocomplete() {
    const input = document.getElementById('address-input') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        this.map.setCenter(place.geometry.location!);
        this.map.setZoom(15);
        this.marker.setPosition(place.geometry.location!);
        this.latitude = place.geometry.location!.lat();
        this.longitude = place.geometry.location!.lng();
        this.formData.patchValue({
          latitude: this.latitude,
          longitude: this.longitude
        });
        this.updateMapLink();
      }
    });
  }

  updateMapLink() {
    if (this.latitude && this.longitude) {
      this.mapLink = `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}&z=15`;
      this.formData.patchValue({ link: this.mapLink });
    }
  }

  openToMap() {
    if (this.mapLink) window.open(this.mapLink, '_blank');
    else if (this.objEditData?.link) window.open(this.objEditData?.link, '_blank');
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(`Registro ${edit ? 'editado' : 'guardado'}.`, 'save')
      .afterClosed()
      .subscribe((_) => this.toBack());
  }

  clearForm() {
    this.formData.reset();
  }

  toBack() {
    this.router.navigateByUrl(`/assets/management`)
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
