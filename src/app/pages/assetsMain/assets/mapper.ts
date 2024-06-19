import * as moment from 'moment-timezone';
import * as entity from './assets-model';
import { FormatsService } from '@app/shared/services/formats.service';

export class Mapper {
	static getDataRespSiteMapper(response: entity.DataDetails[], formatsService: FormatsService): entity.DataResponseDetailsMapper[] {
		let dataList: entity.DataResponseDetailsMapper[] = [];

		response.forEach((data: any): void => {
			let formattedValue: string = data.value;

			if (data.value.includes('.') || data.value === '0') formattedValue = formatsService.energyFormat(parseFloat(data.value));
			else formattedValue = formatsService.dateFormat(data.value);

			dataList.push({
				title: data.title,
				description: formattedValue ?? null
			});
		});

		return dataList
	}

	static getDataAssetsmanagementMapper(response: entity.DataManagementTableResponse, formatsService: FormatsService): entity.DataManagementTableResponse {
		let dataList: entity.DataManagementTable[] = [];

		response.data.forEach((data: entity.DataManagementTable): void => {

			dataList.push({
				...data,
				commissionDate: formatsService.dateFormat(data.commissionDate),
				contractSignatureDate: formatsService.dateFormat(data.contractSignatureDate),
				endInstallationDate: formatsService.dateFormat(data.endInstallationDate)
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static getDataRespStatusMapper(response: entity.ProjectStatus[], formatsService: FormatsService) : entity.ProjectStatus[] {
		let dataList: entity.ProjectStatus[] = [];

		response.forEach((data: entity.ProjectStatus): void => {			
			dataList.push({
				...data,
				endInstallationDate: formatsService.dateFormat(data.endInstallationDate),
			});
		});

		return dataList
	}

	static getDataRespOverviewMapper(response: entity.DataResponseDetailsClient, formatsService: FormatsService): entity.DataResponseDetailsMapper[] {
		let dataList: entity.DataResponseDetailsMapper[] = [];

		dataList.push({
			title: 'RPU',
			description: response.rpu ?? null
		});
		dataList.push({
			title: 'Age of the site',
			description: response.ageOfTheSite ?? null
		});
		dataList.push({
			title: 'Mounting Technology',
			description: response.mountingTechnology ?? null
		});
		dataList.push({
			title: 'Install Date',
			description: formatsService.dateFormat(response.endInstallationDate) ?? null
		});
		dataList.push({
			title: 'COD',
			description: formatsService.dateFormat(response.contractSignatureDate) ?? null
		});
		dataList.push({
			title: 'Roof Type',
			description: response.roofType ?? null
		});
		dataList.push({
			title: 'Commission Date',
			description: formatsService.dateFormat(response.commissionDate) ?? null
		});
		dataList.push({
			title: 'Payment Due Date',
			description: 'N/A'
		});
		dataList.push({
			title: 'Plant Code',
			description: response.plantCode ?? 'N/A'
		});

		return dataList
	}

	static mapToClientData(mapperData: entity.DataResponseDetailsMapper): Partial<entity.DataResponseDetailsClient> {
		const clientData: Partial<entity.DataResponseDetailsClient> = {};

		switch (mapperData.title) {
			case 'Install Date':
				clientData.endInstallationDate = mapperData.description;
				break;
			case 'COD':
				clientData.contractSignatureDate = mapperData.description;
				break;
			case 'Commission Date':
				clientData.commissionDate = mapperData.description;
				break;
			default:
				break;
		}
		return clientData;
	}


	static getDataIdMapper(response: entity.DataPlant): entity.DataPlant {
		return {
			...response,
			assetStatusIcon: response.assetStatus.toLowerCase().includes('active') ? 'radio_button_checked'
				: response.assetStatus.toLowerCase().includes('defaulter') ? 'warning'
					: response.assetStatus.toLowerCase().includes('under construction') ? 'engineering'
						: response.assetStatus.toLowerCase().includes('under permitting process') ? 'assignment'
							: response.assetStatus.toLowerCase().includes('without Off-taker') ? 'person_off'
								: 'help_outline'
		}

	}

	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const utcTime = moment.utc();
		const localTime = utcTime.tz(response.timeZoneId);
		return localTime.format('hh:mm A');
	}
}
