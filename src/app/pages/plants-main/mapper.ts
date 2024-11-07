import * as moment from 'moment-timezone';
import * as entity from './plants-model';
import { FormatsService } from '@app/shared/services/formats.service';

export class Mapper {
	static getSiteDetailsMapper(response: entity.DataSiteDetails, formatsService: FormatsService): entity.DataResponseMapper {
		const primaryElements: entity.DataResponseDetailsCard[] = []
		const additionalItems: entity.DataResponseDetailsCard[] = []

		primaryElements.push({
			title: 'Last connection timeStamp',
			description: formatsService.dateFormat(response.lastConnectionTimestamp)
		});

		primaryElements.push({
			title: 'System size',
			description: formatsService.energyFormat(response.systemSize)
		});

		primaryElements.push({
			title: 'Panels',
			description: formatsService.energyFormat(response.panels)
		});

		primaryElements.push({
			title: 'PPA Duration',
			description: formatsService.formatContractDuration(response.contractDuration)
		});

		additionalItems.push({
			title: 'RPU',
			description: response.rpu
		});

		additionalItems.push({
			title: 'Age of the site',
			description: `${response.ageOfTheSite} ${response.ageOfTheSite > 1 ? 'Years' : 'Year'}`
		});

		additionalItems.push({
			title: 'Install date',
			description: formatsService.dateFormat(response.installDate)
		});

		additionalItems.push({
			title: 'COD',
			description: formatsService.dateFormat(response.cod)
		});

		additionalItems.push({
			title: 'Commission date',
			description: formatsService.dateFormat(response.commissionDate)
		});

		return {
			primaryElements,
			additionalItems
		}
	}

	static getPlantsMapper(response: entity.DataManagementTableResponse, formatsService: FormatsService): entity.DataManagementTableResponse {
		let dataList: entity.DataManagementTable[] = [];

		response?.data.forEach((data: entity.DataManagementTable): void => {

			dataList.push({
				...data,
				systemSize: formatsService.energyFormat(data.systemSize),
				numberOfInvestors: formatsService.energyFormat(data.numberOfInvestors),
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

	static getDataRespStatusMapper(response: entity.ProjectStatus[], formatsService: FormatsService): entity.ProjectStatus[] {
		let dataList: entity.ProjectStatus[] = [];

		response.forEach((data: entity.ProjectStatus): void => {
			dataList.push({
				...data,
				endInstallationDate: formatsService.dateFormat(data.endInstallationDate),
			});
		});

		return dataList
	}

	static getSummaryProjects(response: entity.DataSummaryProjectsMapper, formatsService: FormatsService): entity.DataSummaryProjectsMapper {
		return {
			noOfSites: formatsService.energyFormat(parseFloat(response.noOfSites)),
			noOfModules: formatsService.energyFormat(parseFloat(response.noOfModules)),
			noOfInverters: formatsService.energyFormat(parseFloat(response.noOfInverters)),
			mWpInstalled: formatsService.energyFormat(parseFloat(response.mWpInstalled))
		}
	}

	static getDataRespOverviewMapper(response: entity.DataResponseDetailsClient, formatsService: FormatsService): entity.DataResponseDetailsCard[] {
		let dataList: entity.DataResponseDetailsCard[] = [];

		dataList.push({
			title: 'RPU',
			description: response.rpu ?? null
		});
		dataList.push({
			title: 'Age of the site',
			description: `${response.ageOfTheSite} ${response.ageOfTheSite > 1 ? 'Years' : 'Year'}`
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
			title: 'Commission Date',
			description: formatsService.dateFormat(response.commissionDate) ?? null
		});

		return dataList
	}

	static mapToClientData(mapperData: entity.DataResponseDetailsCard): Partial<entity.DataResponseDetailsClient> {
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
			assetStatusIcon: response?.descriptionStatus?.toLowerCase()?.includes('active') ? 'radio_button_checked'
				: response?.descriptionStatus?.toLowerCase()?.includes('defaulter') ? 'warning'
					: response?.descriptionStatus?.toLowerCase()?.includes('under construction') ? 'engineering'
						: response?.descriptionStatus?.toLowerCase()?.includes('under permitting process') ? 'assignment'
							: response?.descriptionStatus?.toLowerCase()?.includes('without Off-taker') ? 'person_off'
								: 'help_outline'
		}

	}

	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const utcTime = moment.utc();
		const localTime = utcTime.tz(response.timeZoneId);
		return localTime?.format('hh:mm A');
	}

	static getInstalacionesMapper(response: any): entity.Instalations {
		let instalaciones: entity.Equipment[] = [];
		instalaciones.push({
			equipmentId: "0",
			moduloQty: 0,
			moduloBrand: "",
			moduloModel: "",
			title: "Mounting Technology",
			description: response.mountingTechnology,

		});
		instalaciones.push({
			equipmentId: "0",
			moduloQty: 0,
			moduloBrand: "",
			moduloModel: "",
			title: "Roof Type",
			description: response.roofType,
		})

		response.equipment.map((data: entity.Equipment, i: number) => {
			instalaciones.push(
				{
					equipmentId: data.equipmentId,
					moduloQty: data.moduloQty,
					moduloBrand: data.moduloBrand,
					moduloModel: data.moduloModel,
					inverterBrandId: data.inverterBrandId,
					inverterModelId: data.inverterModelId,
					moduloModelId: data.moduloModelId,
					moduloBrandId: data.moduloBrandId,
					orientation: data.orientation,
					tilt: data.tilt,
					serialNumber: data?.serialNumber,
					title: `Inverter ${i + 1} - ${data.moduloBrand}`,
					description: `${data.moduloQty}  ${data.moduloModel}`,
				}
			)
		})


		return {
			...response,
			equipment: instalaciones
		}
	}
}
