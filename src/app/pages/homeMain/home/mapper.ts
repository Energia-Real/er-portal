import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';
import { C } from '@angular/cdk/scrolling-module.d-ud2XrbF8';

export class Mapper {
	static getDataClientsMapper(response: entity.DataTablePlantsResponse, formatsService: FormatsService): entity.DataRespSavingDetailsMapper {
		const data = response.response.consolidatedData;
		let unitMeasu: string = 'kWh';

		let unifiedArray: any[] = [];
		let totalEnergyConsumption: number = 0;
		let totalEnergyProduction: number = 0;

		const dataList = data.map((item) => {
			totalEnergyConsumption += item.energyConsumption;
			totalEnergyProduction += item.energyProduction;

			return {
				plantId: item.plantId || '',
				siteName: item.siteName || '',
				solarCoverage: item.solarCoverage,
				energyConsumption: item.energyConsumption.toString(),
				energyProduction: item.energyProduction.toString(),
				energyConsumptionFormat: `${item.energyConsumption} ${item.energyConsumptionMeasure}`,
				energyProductionFormat: `${item.energyProduction} ${item.energyProductionMeasure}`,
				co2Saving: item.co2Saving,
				siteStatus: item.siteStatus,
				unitProductionMeasure: item.energyProductionMeasure!,
				unitConsumptionMeasure: item.energyConsumptionMeasure!,
			};
		});

		const unitIndex = { kWh: 0, MWh: 1, GWh: 2 };
		let finalUnit = 'kWh';

		for (const item of data) {
			const consumptionUnit = item.energyConsumptionMeasure;
			const productionUnit = item.energyProductionMeasure;

			if (
				consumptionUnit &&
				unitIndex[consumptionUnit as keyof typeof unitIndex] > unitIndex[finalUnit as keyof typeof unitIndex]
			) {
				finalUnit = consumptionUnit as keyof typeof unitIndex;
			}

			if (
				productionUnit &&
				unitIndex[productionUnit as keyof typeof unitIndex] > unitIndex[finalUnit as keyof typeof unitIndex]
			) {
				finalUnit = productionUnit as keyof typeof unitIndex;
			}

		}

		function convertValue(value: number, from?: string, to?: string): number {
			const power = unitIndex[to as keyof typeof unitIndex] - unitIndex[from as keyof typeof unitIndex];
			return value / Math.pow(1000, power);
		}

		unifiedArray = data.map(item => {
			const convertedConsumption = convertValue(item.energyConsumption, item.energyConsumptionMeasure, finalUnit);
			const convertedProduction = convertValue(item.energyProduction, item.energyProductionMeasure, finalUnit);

			return {
				...item,
				energyConsumption: convertedConsumption.toString(),
				energyProduction: convertedProduction.toString(),
				energyConsumptionMeasure: finalUnit,
				energyProductionMeasure: finalUnit,

			};
		});

		return {
			data: dataList,
			dataFormatted: unifiedArray,
			unitMeasu: finalUnit,
		};
	}

	static getDataSolarCoverage(response: entity.DataSolarCoverage, formatsService: FormatsService): entity.FormatCards[] {
		let dataList: entity.FormatCards[] = [];
		if (response.data.length > 1) {
			response.data.forEach((data: entity.FormatCards, i): void => {
				dataList.push({
					title: data?.title,
					value: i == 0 ? data.value + '%' : formatsService.energyFormat(parseFloat(data.value)) + ' TCO²'
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
		return {
			co2_saving_tCO2: formatsService.energyWithoutDecimalsOrKWH(response?.response?.co2_saving_tCO2),
			tree_equivalent: formatsService.energyWithoutDecimalsOrKWH(response?.response?.tree_equivalent),
			ev_charges_equivalent: formatsService.energyWithoutDecimalsOrKWH(response?.response?.ev_charges_equivalent)
		}
	}

	static getDataSavingDetailsMapper(response: entity.SavingDetailsResponse, formatsService: FormatsService): entity.SDResponse {
		return {
			...response.response,
			totalEnergyConsumption: `${formatsService.energyWithoutDecimalsOrKWH(response?.response?.totalEnergyConsumption)} ${response?.response?.energyConsumptionMeasure}`,
			totalEnergyProduction: `${formatsService.energyWithoutDecimalsOrKWH(response?.response?.totalEnergyProduction)} ${response?.response?.energyProductionMeasure}`,
		}
	}
}
