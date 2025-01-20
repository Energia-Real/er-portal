import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './energy-production-model';

export class Mapper {
	static getEnergyProdDataDataMapper(response: entity.DataTableEnergyProdResponse, formatsService: FormatsService) : entity.DataEnergyProdTablMapper {
		console.log(response);
		let dataList: entity.DataEnergyProdTable[] = [];

		response?.response?.data.forEach((data: entity.DataEnergyProdTable): void => {
			dataList.push({
				...data,
				energyMonth1: formatsService.energyWithDecimals(data.energyMonth1),
				energyMonth2: formatsService.energyWithDecimals(data.energyMonth2),
				energyMonth3: formatsService.energyWithDecimals(data.energyMonth3),
				energyMonth4: formatsService.energyWithDecimals(data.energyMonth4),
				energyMonth5: formatsService.energyWithDecimals(data.energyMonth5),
				energyMonth6: formatsService.energyWithDecimals(data.energyMonth6),
				energyMonth7: formatsService.energyWithDecimals(data.energyMonth7),
				energyMonth8: formatsService.energyWithDecimals(data.energyMonth8),
				energyMonth9: formatsService.energyWithDecimals(data.energyMonth9),
				energyMonth10: formatsService.energyWithDecimals(data.energyMonth10),
				energyMonth11: formatsService.energyWithDecimals(data.energyMonth11),
				energyMonth12: formatsService.energyWithDecimals(data.energyMonth12),
				annualTotal: formatsService.energyWithDecimals(data.annualTotal),

			});
		});

		console.log(dataList);
		
		
		return {
			...response.response,
			data: dataList
		}
	}
}
