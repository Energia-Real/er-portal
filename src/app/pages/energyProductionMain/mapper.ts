import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './energy-production-model';

export class Mapper {
	static getEnergyProdDataDataMapper(response: entity.DataTableEnergyProdResponse, formatsService: FormatsService) : entity.DataEnergyProdTablMapper {
		let dataList: entity.DataEnergyProdTable[] = [];

		response?.response?.data.forEach((data: entity.DataEnergyProdTable): void => {
			dataList.push({
				...data,
				energyMonth1: formatsService.energyWithDecimals(data.energyMonth1, true),
				energyMonth2: formatsService.energyWithDecimals(data.energyMonth2, true),
				energyMonth3: formatsService.energyWithDecimals(data.energyMonth3, true),
				energyMonth4: formatsService.energyWithDecimals(data.energyMonth4, true),
				energyMonth5: formatsService.energyWithDecimals(data.energyMonth5, true),
				energyMonth6: formatsService.energyWithDecimals(data.energyMonth6, true),
				energyMonth7: formatsService.energyWithDecimals(data.energyMonth7, true),
				energyMonth8: formatsService.energyWithDecimals(data.energyMonth8, true),
				energyMonth9: formatsService.energyWithDecimals(data.energyMonth9, true),
				energyMonth10: formatsService.energyWithDecimals(data.energyMonth10, true),
				energyMonth11: formatsService.energyWithDecimals(data.energyMonth11, true),
				energyMonth12: formatsService.energyWithDecimals(data.energyMonth12, true),
				annualTotal: formatsService.energyWithDecimals(data.annualTotal, true),
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}
