import { Subject } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-invoice-details',
  standalone: false,
  templateUrl: './modal-invoice-details.component.html',
  styleUrl: './modal-invoice-details.component.scss'
})
export class ModalInvoiceDetailsComponent {
  private onDestroy$ = new Subject<void>();

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create"| "View" = "Create";
  @Input() set invoice(invoiceData: any | null | undefined) {
    console.log(invoiceData);
  }

}
