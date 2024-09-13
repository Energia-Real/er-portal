import * as moment from 'moment-timezone';
import * as entity from './energy-production-model';
import { FormatsService } from '@app/shared/services/formats.service';

export class Mapper {
	static getEnergyProdDataDataMapper(response: entity.DataTableEnergyProdResponse) : entity.DataEnergyProdTable[] {
		
		
		let dataList: entity.DataEnergyProdTable[] = [];

		response?.response.energyProducedResponses.forEach((data: entity.DataEnergyProdTable): void => {
			dataList.push({
				...data,
			});
		});
		

		return dataList
		// return {
		// 	...response,
		// 	data: dataList
		// }
	}
}
