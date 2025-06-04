import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './energy-production-model';

export class Mapper {
	static getEnergyProdDataDataMapper(response: entity.DataTableEnergyProdResponse, formatsService: FormatsService) : entity.DataEnergyProdTablMapper {
		let dataList: entity.DataEnergyProdTable[] = [];

		response?.response?.data.forEach((data: entity.DataEnergyProdTable): void => {
			dataList.push({
				...data,
				energyMonth1: formatsService.energyWithDecimalsOrKWH(data.energyMonth1, true),
				energyMonth2: formatsService.energyWithDecimalsOrKWH(data.energyMonth2, true),
				energyMonth3: formatsService.energyWithDecimalsOrKWH(data.energyMonth3, true),
				energyMonth4: formatsService.energyWithDecimalsOrKWH(data.energyMonth4, true),
				energyMonth5: formatsService.energyWithDecimalsOrKWH(data.energyMonth5, true),
				energyMonth6: formatsService.energyWithDecimalsOrKWH(data.energyMonth6, true),
				energyMonth7: formatsService.energyWithDecimalsOrKWH(data.energyMonth7, true),
				energyMonth8: formatsService.energyWithDecimalsOrKWH(data.energyMonth8, true),
				energyMonth9: formatsService.energyWithDecimalsOrKWH(data.energyMonth9, true),
				energyMonth10: formatsService.energyWithDecimalsOrKWH(data.energyMonth10, true),
				energyMonth11: formatsService.energyWithDecimalsOrKWH(data.energyMonth11, true),
				energyMonth12: formatsService.energyWithDecimalsOrKWH(data.energyMonth12, true),
				annualTotal: formatsService.energyWithDecimalsOrKWH(data.annualTotal, true),
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}
