import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './home-model';

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

		const gwhArray = data.filter(item => item.energyConsumptionMeasure === 'GWh');
		const mwhArray = data.filter(item => item.energyConsumptionMeasure === 'MWh');
		const kwhArray = data.filter(item => item.energyConsumptionMeasure === 'kWh');

		if (gwhArray.length) {
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
				energyProduction: (item.energyProduction / 1_000_000).toString(),
				energyConsumptionMeasure: 'GWh',
				energyProductionMeasure: 'GWh',
			}));
			unifiedArray = [...gwhArray, ...mwhToGwh, ...kwhToGwh];
			unitMeasu = 'GWh';
		} else if (mwhArray.length) {
			const kwhToMwh = kwhArray.map(item => ({
				...item,
				energyConsumption: (item.energyConsumption / 1000).toString(),
				energyProduction: (item.energyProduction / 1000).toString(),
				energyConsumptionMeasure: 'MWh',
				energyProductionMeasure: 'MWh',
			}));
			unifiedArray = [...mwhArray, ...kwhToMwh];
			unitMeasu = 'MWh';
		} else {
			unifiedArray = [...kwhArray];
		}

		return {
			data: dataList,
			dataFormatted: unifiedArray,
			unitMeasu,
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
