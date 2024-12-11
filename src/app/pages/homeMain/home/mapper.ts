import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';

export class Mapper {
	static getDataClientsMapper(response: entity.DataTablePlantsResponse, formatsService: FormatsService): any {
		let totalEnergyConsumption: number = 0;
		let totalEnergyProduction: number = 0;

		let dataList: entity.PlantData[] = [];

		response.response.consolidatedData.forEach((data: entity.PlantData): void => {
			const energyConsumption = data?.energyConsumption;
			totalEnergyConsumption += energyConsumption;
			const energyProduction = data?.energyProduction
			totalEnergyProduction += energyProduction;

			dataList.push({
				plantId: data?.plantId || '',
				siteName: data?.siteName || '',
				solarCoverage: data?.solarCoverage || 0,
				co2Saving: formatsService.energyFormat(data?.co2Saving),
				energyConsumption: formatsService.energyFormat(data?.energyConsumption),
				energyProduction: formatsService.energyFormat(data?.energyProduction),
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

	static getDataSolarCoverage(response: entity.DataSolarCoverage, formatsService: FormatsService): entity.FormatCards[] {
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

	static getCo2SavingMapper(response: entity.Co2Saving, formatsService: FormatsService): entity.Co2SavingResponse {

		return  {
			co2_saving_tCO2 : formatsService.energyFormat(response?.response?.co2_saving_tCO2),
			tree_equivalent : formatsService.energyFormat(response?.response?.tree_equivalent),
			ev_charges_equivalent : formatsService.energyFormat(response?.response?.ev_charges_equivalent)
		}
	}

	static getDataSavingDetailsMapper(response: entity.SavingDetailsResponse, formatsService: FormatsService): entity.SDResponse {
		return  {
			totalEnergyConsumption: formatsService.energyWithDecimals(response.response.totalEnergyConsumption),
			totalEnergyProduction: formatsService.energyWithDecimals(response.response.totalEnergyProduction),
			cfeCostWithoutSolar: formatsService.energyWithDecimals(response.response.cfeCostWithoutSolar),
			totalSavings: formatsService.energyWithDecimals(response.response.totalSavings)
		}
	}
}
