import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';

export class Mapper {
	static getDataClientsMapper(response: entity.DataRespSavingDetails[], formatsService: FormatsService ): entity.DataRespSavingDetailsMapper {
		let totalEnergyConsumption: number = 0;
		let totalEnergyProduction: number = 0;

		let dataList: entity.DataRespSavingDetails[] = [];

		response.forEach((data: entity.DataRespSavingDetails): void => {
			const energyConsumption = parseFloat(data?.energyConsumption);
			totalEnergyConsumption += energyConsumption;
			const energyProduction = parseFloat(data?.energyProduction);
			totalEnergyProduction += energyProduction;

			dataList.push({
				siteId: data?.siteId || '',
				siteName: data?.siteName || '',
				siteSaving: data?.siteSaving,
				cfeZone: data?.cfeZone,
				solarCoverage: data?.solarCoverage || '',
				co2Saving: data?.co2Saving  || '',
				energyConsumption: formatsService.energyFormat(parseFloat(data?.energyConsumption)),
				energyProduction: formatsService.energyFormat(parseFloat(data?.energyProduction)),
			});
		});

		return {
			data: dataList,
			savingDetails: {
				totalEnergyConsumption: formatsService.energyFormat(totalEnergyConsumption),
				totalEnergyProduction: formatsService.energyFormat(totalEnergyProduction),
			}
		};
	}
}
