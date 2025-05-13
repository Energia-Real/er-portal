import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';

export class Mapper {
	static getDataClientsMapper(response: entity.DataTablePlantsResponse, formatsService: FormatsService): any {
		console.log(response.response.consolidatedData);
		const data = response.response.consolidatedData;
		let unit: string = 'kWh'

		const gwhArray = data.filter(item => item.energyConsumptionMeasure === 'GWh');
		const mwhArray = data.filter(item => item.energyConsumptionMeasure === 'MWh');
		const kwhArray = data.filter(item => item.energyConsumptionMeasure === 'kWh');

		let unifiedArray: any[] = [];

		if (gwhArray?.length) {
			const mwhToGwh = mwhArray.map(item => ({
				...item,
				energyConsumption: (item.energyConsumption / 1000).toString(),
				energyProduction: (item.energyProduction / 1000).toString(),
				energyConsumptionMeasure: 'GWh',
				energyProductionMeasure: 'GWh',
			}));
			const kwhToGwh = kwhArray.map(item => ({
				...item,
				energyConsumption: (item.energyConsumption / 1_000_000).toString(),
				energyProduction: item.energyProduction / 1_000_000,
				energyConsumptionMeasure: 'GWh',
				energyProductionMeasure: 'GWh',
			}));
			unit = 'GWh';

			unifiedArray = [...gwhArray, ...mwhToGwh, ...kwhToGwh];

		} else if (mwhArray?.length) {
			const kwhToMwh = kwhArray.map(item => ({
				...item,
				energyConsumption: item.energyConsumption / 1000,
				energyProduction: item.energyProduction / 1000,
				energyConsumptionMeasure: 'MWh',
				energyProductionMeasure: 'MWh',
			}));
			unit = 'MWh';
			unifiedArray = [...mwhArray, ...kwhToMwh];

		} else {
			unifiedArray = [...kwhArray];

		}

		console.log('Unificado:', unifiedArray);


		let totalEnergyConsumption: number = 0;
		let totalEnergyProduction: number = 0;

		let dataList: entity.PlantData[] = [];

		data.forEach((data: entity.PlantData): void => {
			const energyConsumption = data?.energyConsumption;
			totalEnergyConsumption += energyConsumption;
			const energyProduction = data?.energyProduction
			totalEnergyProduction += energyProduction;

			dataList.push({
				plantId: data?.plantId || '',
				siteName: data?.siteName || '',
				solarCoverage: data?.solarCoverage,
				energyConsumption: data.energyConsumption.toString(),
				energyProduction: data.energyProduction.toString(),
				energyConsumptionFormat: `${data.energyConsumption} ${data.energyConsumptionMeasure}`,
				energyProductionFormat: `${data.energyProduction} ${data.energyProductionMeasure}`,
				co2Saving: data.co2Saving,
				siteStatus: data?.siteStatus,
				unitProductionMeasure: data?.energyProductionMeasure!,
				unitConsumptionMeasure: data?.energyConsumptionMeasure!,
			});
		});

		return {
			data: dataList,
			dataFormatted: unifiedArray,
			unit
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
			co2_saving_tCO2: formatsService.energyFormat(response?.response?.co2_saving_tCO2),
			tree_equivalent: formatsService.energyFormat(response?.response?.tree_equivalent),
			ev_charges_equivalent: formatsService.energyFormat(response?.response?.ev_charges_equivalent)
		}
	}

	static getDataSavingDetailsMapper(response: entity.SavingDetailsResponse, formatsService: FormatsService): entity.SDResponse {
		return {
			...response.response,
			totalEnergyConsumption: `${response?.response?.totalEnergyConsumption} ${response?.response?.energyConsumptionMeasure}`,
			totalEnergyProduction: `${response?.response?.totalEnergyProduction} ${response?.response?.energyProductionMeasure}`,
		}
	}
}
