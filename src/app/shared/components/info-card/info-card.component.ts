import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MaterialModule } from '@app/shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { MessageNoDataComponent } from '../message-no-data/message-no-data.component';
import { Store } from '@ngrx/store';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { PlantsService } from '@app/pages/plants-main/plants.service';

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.scss'],
    imports: [
        MaterialModule,
        CommonModule,
        FormsModule,
        MessageNoDataComponent,
    ],
    standalone: true

})
export class InfoCardComponent {
  @Input() tapName: string = '';
  @Input() info: any;
  @Input() executeFunction!: Function;
  @Input() tooltipText!: string;
  @Input() fromEquipments!: boolean;
  @Input() materialIconName!: string;
  @Input() canEditCard!: boolean;
  @Output() infoEdited = new EventEmitter<any>();
  @ViewChild('editableDescription') editableDescription!: ElementRef<HTMLHeadingElement>;
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;

  originalTitle = '';
  isEditing = false;
  specialTitles = ['Commission Date', 'COD', 'Install Date'];

  constructor(
    private store: Store,
    private moduleService: PlantsService
  ) {}

  isSpecialTitle(): boolean {
    return this.specialTitles.includes(this.info?.title);
  }

  editTitle() {
    if (this.canEditCard) {
      if (this.isSpecialTitle()) {
        this.isEditing = true;
        this.openDatePicker();
      } else {
        this.originalTitle = this.info?.description;
        this.isEditing = true;
        setTimeout(() => {
          const range = document.createRange();
          range.selectNodeContents(this.editableDescription.nativeElement);
          const sel = window.getSelection();
          sel!.removeAllRanges();
          sel!.addRange(range);
        }, 0);
      }
    }
  }

  openDatePicker() {
    if (this.datePicker && this.info?.description) {
      this.datePicker.open();
      this.info.description = new Date(this.info.description);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editableDescription.nativeElement.textContent = this.info.description;
  }

  confirmEdit() {
    this.info.description = this.editableDescription.nativeElement.textContent;
    this.isEditing = false;
    this.infoEdited.emit(this.info);
  }

  checkType(value: any): string {
    if (typeof value === "string") {
      return "string";
    } else if (value instanceof Date) {
      return "date";
    } else {
      return "unknown";
    }
  }

  onDateChange(event: any) {
    const date: Date = event;
    const formattedDate = this.formatDate(date);
    this.info.description = formattedDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  editEquipment() {
    this.updDraweState(true);
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.info, needReload: false }));
  }

  deleteEquipment() {
    this.moduleService.deleteInstalation(this.info.equipmentId).subscribe(resp => {
      console.log("eliminado")
      this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Edit", drawerInfo: null, needReload: true }));
    })
  }
}
