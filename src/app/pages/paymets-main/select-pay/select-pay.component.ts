import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormatsService } from '@app/shared/services/formats.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';

@Component({
  selector: 'app-select-pay',
  templateUrl: './select-pay.component.html',
  styleUrl: './select-pay.component.scss'
})
export class SelectPayComponent {

  
  formFilters = this.formBuilder.group({
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: OpenModalsService,
    private formatsService: FormatsService
  ) { }

}
