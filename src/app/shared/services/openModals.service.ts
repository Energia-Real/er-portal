import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationComponent } from '../components/modal-confirmation/modal-confirmation.component';

@Injectable({
	providedIn: 'root',
})
export class OpenModalsService {
	constructor(private dialog: MatDialog) {}

	notificacion(message: string, type: string, customIcon?:string) {
		const data = {
			title : customIcon ? customIcon : type == 'save' ? 'Éxito' : type == 'question' ? '¿Pregunta?': 'Eliminado',
			message,
			icon : {
				show : true,
				name : customIcon ? customIcon : type == 'save' ? 'save' : type == 'question' ? 'question_mark': 'delete',
				color : type == 'save' ? 'success' : type == 'question' ? 'question' : 'error',
			},
			actions : {
				confirm : {
				  show  : true,
				  label : 'Aceptar',
				  color : 'accent'
				},
				cancel : {
				  show : type == 'question',
				  label : 'Cancelar',
				  color : 'accent'
				}
			}
		};

		return this.dialog.open(ModalConfirmationComponent, {
			data,
			disableClose: true,
			panelClass: 'custom-dialog',
		});
	}

	closeDialog() {
		return this.dialog.closeAll();
	}
}
