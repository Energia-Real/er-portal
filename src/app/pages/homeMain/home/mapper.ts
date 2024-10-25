import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';

export class Mapper {
	static getDataClientsMapper(response: entity.DataRespSavingDetails[], formatsService: FormatsService): entity.DataRespSavingDetailsMapper {
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
				// co2Saving: data?.co2Saving || '',
				co2Saving: formatsService.energyFormat(data?.co2Saving),
				energyConsumption: formatsService.energyFormat(parseFloat(data?.energyConsumption)),
				energyProduction: formatsService.energyFormat(parseFloat(data?.energyProduction)),
				siteStatus: data?.siteStatus
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

	static getDataSolarCoverga(response: entity.DataSolarCoverga, formatsService: FormatsService): entity.FormatCards[] {
		let dataList: entity.FormatCards[] = [];
		if (response.data.length > 1) {
			response.data.forEach((data: entity.FormatCards, i): void => {
				dataList.push({
					title: data?.title,
					value: i == 0 ? data.value + '%': formatsService.energyFormat(parseFloat(data.value)) + ' TCO²'
				});
			});
		}

		return dataList
	}

	static getDataBatuSavings(response: any, formatsService: FormatsService) {
		return {
			totalSaving: formatsService.energyFormat(response.totalSaving),
			cO2Saving: formatsService.energyFormat(response.cO2Saving),
			costwoSolarTotal: formatsService.energyFormat(response.costwoSolarTotal),
		}
	}

	static getDataClientsListMapper(response: entity.DataRespSavingDetailsList[]): entity.DataRespSavingDetailsList[] {
		let dataList: entity.DataRespSavingDetailsList[] = [];
		response?.forEach((data: entity.DataRespSavingDetailsList): void => {
			dataList.push({
				...data,
				nombre: data?.nombre || '-',
				imageBase64: data?.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : ''
			});
		});

		return dataList
	}

	static getDataSavingDetailsMapper(response: entity.SavingDetailsResponse): entity.SavingDetailsResponse {

	

		return response
	}
}
