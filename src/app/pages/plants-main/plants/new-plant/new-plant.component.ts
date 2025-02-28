import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';
import * as entityCatalogs from '../../../../shared/models/catalogs-models';
import * as entity from '../../plants-model';
import { Loader } from '@googlemaps/js-api-loader';
import { DataRespSavingDetailsList } from '@app/pages/homeMain/home/home-model';
import { HomeService } from '@app/pages/homeMain/home/home.service';
import { environment } from '@environment/environment';
import { PlantsService } from '../../plants.service';
import { UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { ClientsService } from '@app/pages/clientsMain/clients.service';
import { DataCientList } from '@app/pages/clientsMain/clients-model';

@Component({
  selector: 'app-new-plant',
  templateUrl: './new-plant.component.html',
  styleUrl: './new-plant.component.scss'
})
export class NewPlantComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  formData = this.fb.group({
    siteName: ['', Validators.required],
    plantCode: ['', Validators.required],
    link: [{ value: '', disabled: true }],
    contractTypeId: ['', Validators.required],
    latitude: [0],
    longitude: [0],
    installationTypeId: ['', Validators.required],
    yearlyYield: [''],
    qualityRatio: [''],
    nominalPowerAC: [''],
    commissionDate: ['', Validators.required],
    contractSignatureDate: ['', Validators.required],
    performanceRatio: ['', Validators.required],
    endInstallationDate: ['', Validators.required],
    systemSize: ['', Validators.required],
    rpu: ['', Validators.required],
    statusPlantId: ['', Validators.required],
    netZero: ['', Validators.required],
    searchAddress: ['', Validators.required],
    clientId: ['']
  });

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  latitude: any;
  longitude: any;
  autocomplete!: google.maps.places.Autocomplete;

  catContractType: entityCatalogs.DataCatalogs[] = [];
  catInstallationType: entityCatalogs.DataCatalogs[] = [];
  catPlantStatus: entityCatalogs.DataCatalogs[] = [];
  editedClient!: entity.DataPlant;

  catClients: DataCientList[] = [];

  showLoader: boolean = false;
  loading: boolean = false;

  mapLink: string = ''

  userInfo!: UserInfo;

  constructor(
    private catalogsService: CatalogsService,
    private notificationService: OpenModalsService,
    private fb: FormBuilder,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private moduleServices: PlantsService,
    private router: Router,
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    this.getCatalogs();
    this.mapTo();
    this.getUserClient();
    this.getClients();
  }

  getId() {
    this.activatedRoute?.params.pipe(takeUntil(this.onDestroy$)).subscribe((params: any) => {
      if (params.id) this.getDataById(params.id);
    });
  }

  getDataById(id: string) {
    this.moduleServices.getDataById(id).subscribe({
      next: (response: entity.DataPlant | any) => {
        this.editedClient = response;
        this.formData.patchValue(response);
        this.getAddressMap(response);
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  
  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) this.userInfo = this.encryptionService.decryptData(encryptedData);
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
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const objData: any = { clientId: this.userInfo.clientes[0] }
    this.loading = !this.loading;

    if (this.formData.get('siteName')?.value) objData.siteName = this.formData.get('siteName')?.value;
    if (this.formData.get('plantCode')?.value) objData.plantCode = this.formData.get('plantCode')?.value;
    if (this.formData.get('link')?.value) objData.link = this.formData.get('link')?.value;
    if (this.formData.get('yearlyYield')?.value) objData.yearlyYield = this.formData.get('yearlyYield')?.value;
    if (this.formData.get('nominalPowerAC')?.value) objData.nominalPowerAC = this.formData.get('nominalPowerAC')?.value;
    if (this.formData.get('contractTypeId')?.value) objData.contractTypeId = this.formData.get('contractTypeId')?.value;
    if (this.formData.get('latitude')?.value) objData.latitude = this.formData.get('latitude')?.value;
    if (this.formData.get('longitude')?.value) objData.longitude = this.formData.get('longitude')?.value;
    if (this.formData.get('performanceRatio')?.value) objData.performanceRatio = this.formData.get('performanceRatio')?.value;
    if (this.formData.get('installationTypeId')?.value) objData.installationTypeId = this.formData.get('installationTypeId')?.value;
    if (this.formData.get('commissionDate')?.value) objData.commissionDate = this.formData.get('commissionDate')?.value;
    if (this.formData.get('systemSize')?.value) objData.systemSize = this.formData.get('systemSize')?.value;
    if (this.formData.get('rpu')?.value) objData.rpu = this.formData.get('rpu')?.value;
    if (this.formData.get('statusPlantId')?.value) objData.statusPlantId = this.formData.get('statusPlantId')?.value;
    if (this.formData.get('clientId')?.value) objData.clientId = this.formData.get('clientId')?.value;

    if (this.formData.get('commissionDate')?.value) objData.commissionDate = moment(this.formData.get('commissionDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('endInstallationDate')?.value) objData.endInstallationDate = moment(this.formData.get('endInstallationDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('contractSignatureDate')?.value) objData.contractSignatureDate = moment(this.formData.get('contractSignatureDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('netZero')?.value == 'False') objData.netZero = "False"
    else if (this.formData.get('netZero')?.value == 'True') objData.netZero = "True"
    else objData.netZero = null

    if (this.editedClient) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData: entity.DataPlant) {
    this.moduleServices.postDataPlant(objData).subscribe({
      next: () => { this.completionMessage() },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        this.loading = !this.loading;
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPlant) {
    this.moduleServices.patchDataPlant(this.editedClient.id, objData).subscribe({
      next: () => { this.completionMessage(true) },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        this.loading = !this.loading;
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
        this.formData.patchValue({ searchAddress: address });
      }
    });
  }

  mapTo() {
    const loader = new Loader({
      apiKey: environment.GOOGLE_API_KEY,
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
    else if (this.editedClient?.link) window.open(this.editedClient?.link, '_blank');
  }

  completionMessage(edit = false) {
    this.loading = !this.loading;
    this.notificationService
      .notificacion(`Record ${edit ? 'editado' : 'guardado'}.`, 'save')
      .afterClosed()
      .subscribe((_) => this.toBack());
  }

  clearForm() {
    this.formData.reset();
  }

  toBack() {
    this.router.navigateByUrl(`er/plants`)
  }

  getClients(){
    this.clientsService.getClientsList().subscribe(resp => {
      this.catClients = resp;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
